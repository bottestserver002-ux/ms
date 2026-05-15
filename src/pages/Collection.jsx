import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { addPoem, getPoems } from "../services/api";
import "./modal.css";
import "./login.css";
import "./filter.css";

export default function Collection() {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [poems, setPoems] = useState([]);
  const [filter, setFilter] = useState("all");

  const [openForm, setOpenForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
  });

  useEffect(() => {
    fetchPoems();
  }, []);

  const fetchPoems = async () => {
    const data = await getPoems();
    setPoems(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = async () => {
    await addPoem(form);
    setOpenForm(false);
    setForm({ title: "", category: "", content: "" });
    fetchPoems();
  };

  const categories = [
    "Tất cả",
    ...new Set(poems.map((p) => p.category || "Khác")),
  ];

  const filtered =
    filter === "all"
      ? poems
      : poems.filter((p) => p.category === filter);

  return (
    <div className="container">
      <Navbar />
    
     {/* FILTER */}
<div className="filter-box">
  <select
    className="filter-select"
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="all">Tất cả</option>

    {categories
      .filter((c) => c !== "Tất cả")
      .map((c, i) => (
        <option key={i} value={c}>
          {c}
        </option>
      ))}
  </select>
</div>
      {/* BUTTON ADD (ADMIN ONLY) */}
  
      {isAdmin && (
        <button onClick={() => setOpenForm(!openForm)}>
           
          + Thêm bài thơ
        </button>
       
        
      )}
    
        

      {/* FORM ADD */}
     {openForm && (
  <div className="modal-overlay" onClick={() => setOpenForm(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>

      <h2>✨ Thêm bài thơ mới</h2>

      <input
        name="title"
        placeholder="Tên bài thơ"
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Thể thơ (ngũ ngôn, thất ngôn,...)"
        onChange={handleChange}
      />

      <textarea
        name="content"
        placeholder="Nội dung bài thơ..."
        rows={6}
        onChange={handleChange}
      />

      <div className="modal-actions">
        <button onClick={handleAdd}>💾 Lưu</button>
        <button onClick={() => setOpenForm(false)}>❌ Huỷ</button>
      </div>

    </div>
  </div>
)}

      {/* LIST */}
      {filtered.map((p) => (
        <div key={p.id} className="card" style={{ marginTop: 20 }}>
          <h3>{p.title}</h3>
         <small>
  <strong>Thể thơ:</strong> "{p.category}"
</small>
          <p style={{ whiteSpace: "pre-line" }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}