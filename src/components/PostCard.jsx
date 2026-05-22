import React from "react";
export default function PostCard({ post }) {
  return (
    <div className="card">
      <img src={post.image} alt="" />
      <h3>{post.title}</h3>
      <p>{post.content.slice(0, 100)}...</p>
    </div>
  );
}