import React, { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import Navbar from "../components/Navbar";

import { getPosts } from "../services/api";

export default function PostDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  useEffect(() => {

    fetchPost();

  }, []);

  const fetchPost = async () => {

    const data = await getPosts();

    const found =
      data.find((p) => p.id == id);

    setPost(found);
  };

  if (!post) {
    return <h1>Đang tải...</h1>;
  }

  return (
    <div className="container">

      <Navbar />

      {/* BUTTON BACK */}
      <button
        className="back-btn"
        onClick={() => navigate("/useful")}
      >
        ← Trở về trang bổ ích
      </button>

      <div className="detail-card">

        <img
          src={post.image}
          alt={post.title}
          className="detail-image"
        />

        <h1>
          {post.title}
        </h1>

        <p className="detail-content">
          {post.content}
        </p>

      </div>

    </div>
  );
}