import React from "react";
export default function PoemCard({ poem }) {
  return (
    <div className="card">
      <h3>{poem.title}</h3>
      <p>{poem.content}</p>
    </div>
  );
}