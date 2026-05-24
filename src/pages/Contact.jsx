import Navbar from "../components/Navbar";
import React from "react";

export default function Contact() {
  return (
    <div className="container">

      <Navbar />

      <div className="contact-wrapper">

        <div className="contact-card">

          <h1>Liên hệ</h1>

          <p className="contact-desc">
            Nếu bạn muốn trao đổi, hợp tác hoặc trò chuyện,
            hãy liên hệ với tôi qua các nền tảng bên dưới.
          </p>

          <div className="contact-list">

            <a
              href="mailto:bottestserver002@gmail.com"
              className="contact-item"
            >
              <span className="contact-icon">📧</span>

              <div>
                <h3>Email</h3>
                <p>bottestserver002@gmail.com</p>
              </div>
            </a>

            <a
              href="https://facebook.com/nvmt2003"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className="contact-icon">📘</span>

              <div>
                <h3>Facebook</h3>
                <p>facebook.com/nvmt2003</p>
              </div>
            </a>

            <a
              href="https://zalo.me/0783251109"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className="contact-icon">💬</span>

              <div>
                <h3>Zalo</h3>
                <p>0783251109</p>
              </div>
            </a>

            <a
              href="https://www.tiktok.com/@mtr6723"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className="contact-icon">🎵</span>

              <div>
                <h3>TikTok</h3>
                <p>@mtr6723</p>
              </div>
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}