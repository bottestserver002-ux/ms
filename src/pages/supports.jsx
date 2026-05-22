import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { askAI } from "../services/api";
import "./supports.css";

export default function Supports() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;

    // add user message
    setMessages((prev) => [...prev, { role: "user", text }]);

    // CLEAR INPUT NGAY
    setMessage("");

    try {
      const res = await askAI(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.reply || "Không có phản hồi",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Lỗi kết nối AI" },
      ]);
    }
  };

  return (
    <div className="support-page">
      <Navbar />

     

      <div className="ai-body">
        {/* LEFT */}
        <div className="ai-left">
          <img
            className="robot-img"
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="robot"
          />
        </div>

        {/* RIGHT CHAT */}
        <div className="ai-right">
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "user-msg" : "ai-msg"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="input-box">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập câu hỏi..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      </div>
    </div>
  );
}