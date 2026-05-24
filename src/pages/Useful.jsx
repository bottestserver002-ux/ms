import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getPosts, addPost, deletePost, updatePost } from "../services/api";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./modal.css";

export default function Useful() {
    const navigate = useNavigate();

  const isAdmin =
    localStorage.getItem("is_admin") === "true";

  const [posts, setPosts] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "",
    content: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = async () => {

  if (editingId) {

    await updatePost(editingId, form);

  } else {

    await addPost(form);

  }

  setEditingId(null);

  setOpenForm(false);

  setForm({
    title: "",
    image: "",
    content: "",
  });

  fetchPosts();
};
const handleDelete = async (id) => {

  if (!window.confirm("Bạn muốn xóa bài này?")) return;

  await deletePost(id);

  fetchPosts();
};

const handleEdit = (post) => {

  setEditingId(post.id);

  setForm({
    title: post.title,
    image: post.image,
    content: post.content,
  });

  setOpenForm(true);
};

  return (
    <div className="container">

      <Navbar />

      {/* ADMIN BUTTON */}
      {isAdmin && (
        <button
          className="filter-ok"
          onClick={() => setOpenForm(true)}
        >
          + Thêm bài viết
        </button>
        
        
      )}

      {/* MODAL */}
      {openForm && (
        <div
          className="modal-overlay"
          onClick={() => setOpenForm(false)}
        >

          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>✨ Thêm bài viết mới</h2>

            <input
              name="title"
              placeholder="Tiêu đề bài viết"
              onChange={handleChange}
            />

            <input
              name="image"
              placeholder="Link hình ảnh"
              onChange={handleChange}
            />

           <ReactQuill
  theme="snow"
  value={form.content}
  onChange={(value) =>
    setForm({
      ...form,
      content: value,
    })
  }
  placeholder="Nội dung..."
  className="useful-editor"
/>

            <div className="modal-actions">

              <button onClick={handleAdd}>
                💾 Đăng bài
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

      {/* LIST POSTS */}
<div className="posts-grid">

  {posts.map((p) => (

    <div
      key={p.id}
      className="news-post-card"
    >

      <img
        src={p.image}
        alt={p.title}
        className="news-post-image"
      />

      <div className="news-post-content">

        <h3>
          {p.title}
        </h3>

        <div
  className="useful-content"
  dangerouslySetInnerHTML={{
    __html: p.content.slice(0, 160) + "...",
  }}
/>

        <button
  className="detail-btn"
  onClick={() => navigate(`/post/${p.id}`)}
>
  Xem chi tiết
</button>


        {/* ADMIN BUTTONS */}
        {isAdmin && (

          <div style={{ marginTop: 12 }}>

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

    </div>

 




        ))}

      </div>

    </div>
  );
}