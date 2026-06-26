import React, { useEffect, useState } from "react";
import "./bookingFood.css";
import {
    getFoods,
    addFood,
    updateFood,
    deleteFood,
    orderFood,
} from "../services/api";

const categories = [
    "Món mặn",
    "Món canh",
    "Đồ ăn kèm",
    "Nước uống",
    "Chế Biến Sẵn"
];

export default function BookingFood() {
    const isAdmin = localStorage.getItem("is_admin") === "true";

    const [foods, setFoods] = useState([]);
    const [category, setCategory] = useState("Món mặn");
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [mealTime, setMealTime] = useState("Sáng");

    const [form, setForm] = useState({
        name: "",
        category: "Món mặn",
    });

    const [editingId, setEditingId] = useState(null);

    const loadFoods = async () => {
        const data = await getFoods();
        setFoods(data);
    };

    useEffect(() => {
        loadFoods();
    }, []);

    const filteredFoods = foods
        .filter((item) => item.category === category)
        .sort((a, b) => a.name.localeCompare(b.name, "vi"));

    const addToCart = (food) => {
        const exists = cart.find((item) => item.id === food.id);

        if (exists) {
            alert("Món này đã có trong giỏ hàng");
            return;
        }

        setCart([...cart, food]);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSaveFood = async () => {
        if (!form.name.trim()) {
            alert("Vui lòng nhập tên món");
            return;
        }

        if (editingId) {
            await updateFood(
                editingId,
                form.name,
                form.category,
                imageFile
            );

            setEditingId(null);
        } else {
            await addFood(
                form.name,
                form.category,
                imageFile
            );
        }

        setForm({
            name: "",
            category: "Món mặn",
        });

        setImageFile(null);

        loadFoods();
    };
    const handleEdit = (food) => {
        setEditingId(food.id);
        setForm({
            name: food.name,
            category: food.category,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa món này?")) return;

        await deleteFood(id);
        loadFoods();
    };

    const handleOrder = async () => {
        const selectedItems = cart.filter((item) =>
            selectedIds.includes(item.id)
        );

        if (selectedItems.length === 0) return;

        const data = await orderFood({
            items: selectedItems,
            meal_time: mealTime,
            username: localStorage.getItem("username"),
            email: localStorage.getItem("email"),
        });

        setShowCart(false);
        setCart([]);
        setSelectedIds([]);

        alert(data.message || data.detail || "Bạn đã oder món thành công");
    };

    return (
        <div className="booking-page">
            <div className="booking-header">
                <div>
                    <h1>🍔 Booking Food</h1>
                    <p>Chọn món ăn yêu thích cho hôm nay</p>
                </div>

                <button
                    className="cart-button"
                    onClick={() => setShowCart(true)}
                >
                    🛒 Giỏ hàng ({cart.length})
                </button>
            </div>

            <div className="food-tabs">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={category === cat ? "active" : ""}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isAdmin && (
                <div className="admin-food-box">
                    <h3>{editingId ? "Sửa món ăn" : "Thêm món ăn"}</h3>

                    <input
                        placeholder="Tên món ăn"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />

                    <select
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category: e.target.value,
                            })
                        }
                    >
                        {categories.map((cat) => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>

                    <button onClick={handleSaveFood}>
                        {editingId ? "Cập nhật" : "Thêm món"}
                    </button>
                </div>
            )}

            <div className="food-list">
                {filteredFoods.map((food) => (
                    <div className="food-card" key={food.id}>
                        <div className="food-img-wrap">
                            {food.image ? (
                                <img
                                    src={`https://sm-backend-hbpp.onrender.com${food.image}`}
                                    alt={food.name}
                                    className="food-img"
                                />
                            ) : (
                                <div className="food-img-placeholder">🍽️</div>
                            )}
                        </div>

                        <h3>{food.name}</h3>
                        <p>{food.category}</p>

                        <div className="food-actions">
                            <button onClick={() => addToCart(food)}>
                                Thêm vào giỏ
                            </button>

                            {isAdmin && (
                                <>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(food)}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(food.id)}
                                    >
                                        Xóa
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showCart && (
                <div className="cart-overlay">
                    <div className="cart-modal">
                        <div className="cart-top">
                            <h2>🛒 Giỏ hàng</h2>

                            <button
                                className="close-cart"
                                onClick={() => setShowCart(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="meal-time-box">
                            <p>Bạn muốn ăn buổi nào?</p>

                            <select
                                value={mealTime}
                                onChange={(e) => setMealTime(e.target.value)}
                            >
                                <option>Sáng</option>
                                <option>Chiều</option>
                                <option>Cả ngày</option>
                            </select>
                        </div>

                        {cart.length === 0 ? (
                            <p>Giỏ hàng đang trống.</p>
                        ) : (
                            <div className="cart-list">
                                {cart.map((item) => (
                                    <div className="cart-item" key={item.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                        />

                                        <div>
                                            <h4>{item.name}</h4>
                                            <span>{item.category}</span>
                                        </div>

                                        <button onClick={() => removeFromCart(item.id)}>
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className={
                                selectedIds.length > 0
                                    ? "order-btn active"
                                    : "order-btn"
                            }
                            disabled={selectedIds.length === 0}
                            onClick={handleOrder}
                        >
                            Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}