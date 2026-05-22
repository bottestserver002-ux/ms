import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getPosts, addPost } from "../services/api";
import { useNavigate } from "react-router-dom";

import "./modal.css";

export default function Useful() {
    const navigate = useNavigate();

  const isAdmin =
    localStorage.getItem("is_admin") === "true";

  const [posts, setPosts] = useState([]);

  const [openForm, setOpenForm] = useState(false);

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

    await addPost(form);

    setOpenForm(false);

    setForm({
      title: "",
      image: "",
      content: "",
    });

    fetchPosts();
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

            <textarea
              name="content"
              rows={7}
              placeholder="Nội dung chi tiết..."
              onChange={handleChange}
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

        <p>
          {p.content.slice(0, 70)}...
        </p>

        <button
  className="detail-btn"
  onClick={() => navigate(`/post/${p.id}`)}
>
  Xem chi tiết
</button>

      </div>

    </div>

 




        ))}

      </div>

    </div>
  );
}