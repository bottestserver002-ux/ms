import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  addPoem,
  getPoems,
  deletePoem,
  updatePoem
} from "../services/api";

import "./modal.css";
import "./login.css";
import "./filter.css";


export default function Collection() {

  const isAdmin =
    localStorage.getItem("is_admin") === "true";

  const [poems, setPoems] = useState([]);

  const [filter, setFilter] = useState("all");

  const [openForm, setOpenForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

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

    if (editingId) {

      await updatePoem(editingId, form);

    } else {

      await addPoem(form);
    }

    setEditingId(null);

    setOpenForm(false);

    setForm({
      title: "",
      category: "",
      content: "",
    });

    fetchPoems();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Bạn muốn xóa bài này?")) return;

    await deletePoem(id);

    fetchPoems();
  };

  const handleEdit = (poem) => {

    setEditingId(poem.id);

    setForm({
      title: poem.title,
      category: poem.category,
      content: poem.content,
    });

    setOpenForm(true);
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

          <option value="all">
            Tất cả
          </option>

          {categories
            .filter((c) => c !== "Tất cả")
            .map((c, i) => (

              <option key={i} value={c}>
                {c}
              </option>

            ))}

        </select>

      </div>

      {/* BUTTON ADD */}
      {isAdmin && (

        <button
          onClick={() => setOpenForm(!openForm)}
        >
          + Thêm bài thơ
        </button>

      )}

      {/* FORM */}
      {openForm && (

        <div
          className="modal-overlay"
          onClick={() => setOpenForm(false)}
        >

          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>
              ✨ Thêm bài thơ mới
            </h2>

            <input
              name="title"
              placeholder="Tên bài thơ"
              onChange={handleChange}
              value={form.title}
            />

            <input
              name="category"
              placeholder="Thể thơ"
              onChange={handleChange}
              value={form.category}
            />

            <textarea
              name="content"
              placeholder="Nội dung bài thơ..."
              rows={6}
              onChange={handleChange}
              value={form.content}
            />

            <div className="modal-actions">

              <button onClick={handleAdd}>
                💾 Lưu
              </button>

              <button
                onClick={() => setOpenForm(false)}
              >
                ❌ Huỷ
              </button>

            </div>

          </div>

        </div>
      )}

      {/* GRID */}
      <div className="poem-grid">

        {filtered.map((p) => (

          <div
            key={p.id}
            className="poem-card"
          >

            <h3>{p.title}</h3>

            <div className="poem-category">
              {p.category}
            </div>

            <div className="poem-content">
              {p.content}
            </div>

            {isAdmin && (

              <div className="poem-actions">

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(p)}
                >
                  ✏️ Sửa
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.id)}
                >
                  ❌ Xóa
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}