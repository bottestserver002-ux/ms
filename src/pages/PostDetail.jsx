import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getPosts } from "../services/api";
import "react-quill/dist/quill.snow.css";
import "./Post.css";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const data = await getPosts();

    const found = data.find((p) => p.id == id);
    setPost(found);

    setRecentPosts(
      data
        .filter((p) => p.id != id)
        .slice(0, 4)
    );
  };

  if (!post) {
    return <h1>Đang tải...</h1>;
  }

  return (
   <div className="post-detail-page">
  <div className="post-detail-navbar">
      <Navbar />

      <div className="post-detail-layout">
        <main className="post-main">
          <img
            src={post.image}
            alt={post.title}
            className="post-cover"
          />

          <h1 className="post-title">{post.title}</h1>

          <div className="post-content ql-snow">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />
          </div>
        </main>

        <aside className="post-sidebar">
          <div className="sidebar-box sidebar-cta">
            <h3>Bài viết hữu ích</h3>
            <p>Khám phá thêm những nội dung mới dành cho bạn.</p>
            <button onClick={() => navigate("/useful")}>
              Xem tất cả
            </button>
          </div>

          <div className="sidebar-box">
            <h3>Bài viết gần đây</h3>

            {recentPosts.map((item) => (
              <div
                className="recent-post"
                key={item.id}
                onClick={() => navigate(`/post/${item.id}`)}
              >
                <img src={item.image} alt={item.title} />

                <h4>{item.title}</h4>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
}