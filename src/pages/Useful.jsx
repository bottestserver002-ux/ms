import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getPosts,
  addPost,
  deletePost,
  updatePost,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Useful.css";

export default function Useful() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [posts, setPosts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    image: "",
    content: "",
  });
  const Font = Quill.import("formats/font");

  Font.whitelist = [
    "arial",
    "times-new-roman",
    "roboto",
    "montserrat",
    "georgia",
    "courier-new",
  ];

  Quill.register(Font, true);

  const modules = {
    toolbar: [
      [{ font: Font.whitelist }],

      [{ size: ["small", false, "large", "huge"] }],

      [{ header: [1, 2, 3, false] }],

      ["bold", "italic", "underline"],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      ["link", "image"],

      ["clean"],
    ],
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  const cleanContent = (html) => {
    return html
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p><br\/><\/p>/g, "")
      .replace(/<p>&nbsp;<\/p>/g, "")
      .replace(/(<p>\s*<\/p>)/g, "");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  };

  const handleSave = async () => {
    if (editingId) {
      await updatePost(editingId, {
        ...form,
        content: cleanContent(form.content),
      });
    } else {
      await addPost({
        ...form,
        content: cleanContent(form.content),
      });
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

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      image: post.image,
      content: post.content,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn muốn xóa bài này?")) return;

    await deletePost(id);
    fetchPosts();
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      image: "",
      content: "",
    });
    setOpenForm(true);
  };

  return (
    <div className="useful-page">
      <Navbar />

      <div className="useful-header">

        {isAdmin && (
          <button className="add-post-btn" onClick={openAddForm}>
            + Thêm bài viết
          </button>
        )}
      </div>

      <div className="useful-grid">
        {posts.map((p) => (
          <div className="useful-card" key={p.id}>
            <img src={p.image} alt={p.title} className="useful-card-img" />

            <div className="useful-card-body">
              <h3>{p.title}</h3>

              <p>{stripHtml(p.content).slice(0, 115)}...</p>

              <button
                className="read-more-btn"
                onClick={() => navigate(`/post/${p.id}`)}
              >
                Xem thêm →
              </button>

              {isAdmin && (
                <div className="useful-admin-actions">
                  <button onClick={() => handleEdit(p)}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(p.id)}>❌ Xóa</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {openForm && (
        <div className="modal-overlay" onClick={() => setOpenForm(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "✏️ Sửa bài viết" : "✨ Thêm bài viết mới"}</h2>

            <input
              name="title"
              placeholder="Tiêu đề bài viết"
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="image"
              placeholder="Link hình ảnh bìa"
              value={form.image}
              onChange={handleChange}
            />

            <ReactQuill
              theme="snow"
              value={form.content}
              modules={modules}
              onChange={(value) =>
                setForm({
                  ...form,
                  content: value,
                })
              }
              className="post-editor"
              placeholder="Nội dung bài viết..."
            />

            <div className="post-modal-actions">
              <button onClick={handleSave}>💾 Lưu bài</button>
              <button onClick={() => setOpenForm(false)}>❌ Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}