import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const API = "https://sm-backend-hbpp.onrender.com";

export default function UserProfile() {
    const navigate = useNavigate();

    const userId = localStorage.getItem("user_id");

    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);

    const [birthday, setBirthday] = useState("");
    const [job, setJob] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        fetch(`${API}/profile/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setProfile(data);
                setBirthday(data.birthday || "");
                setJob(data.job || "");
                setGender(data.gender || "");
            });
    }, [userId, navigate]);

    const handleUpdate = async () => {
        const formData = new FormData();

        formData.append("birthday", birthday);
        formData.append("job", job);
        formData.append("gender", gender);

        if (avatar) {
            formData.append("avatar", avatar);
        }

        const res = await fetch(`${API}/profile/${userId}`, {
            method: "PUT",
            body: formData,
        });

        const data = await res.json();

        if (res.ok) {
            setProfile(data.user);

            localStorage.setItem("avatar", data.user.avatar || "");
            window.dispatchEvent(new Event("avatarUpdated"));

            setEditing(false);
            alert("Cập nhật thành công!");
        } else {
            alert(data.detail || "Cập nhật thất bại");
        }
    };
    if (!profile) return null;

    return (
        <div className="container">
            <Navbar />

            <section className="user-profile-page">
                <div className="user-profile-card">
                    <div className="avatar-area">
                        <div className="big-avatar">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="avatar" />
                            ) : (
                                <span>{profile.username?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        {editing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                        )}
                    </div>

                    <div className="profile-info">
                        <h1>Thông tin cá nhân</h1>

                        <div className="info-row">
                            <label>Họ tên</label>
                            <p>{profile.username}</p>
                        </div>

                        <div className="info-row">
                            <label>Email</label>
                            <p>{profile.email}</p>
                        </div>

                        <div className="info-row">
                            <label>Ngày sinh</label>
                            {editing ? (
                                <input
                                    type="date"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                />
                            ) : (
                                <p>{profile.birthday || "Chưa cập nhật"}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Nghề nghiệp</label>
                            {editing ? (
                                <input
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                    placeholder="Nhập nghề nghiệp"
                                />
                            ) : (
                                <p>{profile.job || "Chưa cập nhật"}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Giới tính</label>
                            {editing ? (
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            ) : (
                                <p>{profile.gender || "Chưa cập nhật"}</p>
                            )}
                        </div>

                        <div className="profile-actions">
                            {editing ? (
                                <>
                                    <button className="save-btn" onClick={handleUpdate}>
                                        Lưu thông tin
                                    </button>

                                    <button
                                        className="cancel-btn"
                                        onClick={() => setEditing(false)}
                                    >
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="edit-profile-btn"
                                    onClick={() => setEditing(true)}
                                >
                                    ✏️ Cập nhật thông tin
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}