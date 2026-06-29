import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


import logo from "../assets/logo.png";
import avatar1 from "../assets/gg.png";
import minigameImg from "../assets/minigame.png";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const isFamily = localStorage.getItem("is_family") === "true";
  const [openTools, setOpenTools] = useState(false);

  const username =
    localStorage.getItem("username") || "Khách";

  const [stats, setStats] = useState({
    visits: 0,
    contents: 0,
    users: 0,
    status: "24/7",
  });

  const API =
    "https://sm-backend-hbpp.onrender.com";

  useEffect(() => {
    fetch(`${API}/stats/visit`, {
      method: "POST",
    });

    fetch(`${API}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="container">
      <Navbar />

      <section className="home-hero">
        <div className="hero-left">
          <h1>
            Xin chào, <span>{username.toUpperCase()}</span> 👋
          </h1>

          <h3>Chào mừng bạn đến với không gian của tôi</h3>

          <p>
            Nơi tôi chia sẻ những vần thơ, kiến thức hữu ích,
            góc nhìn cuộc sống và những công cụ giúp công việc
            hiệu quả hơn mỗi ngày.
          </p>

          <div className="hero-actions">
            <button className="explore-btn">🔎 Khám phá ngay</button>

            <button
              className="about-btn"
              onClick={() => navigate("/profile")}
            >
              Về tôi
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="laptop-card">
            <img src={logo} alt="MTU Logo" className="laptop-logo" />
          </div>

          <div className="plant"></div>
          <div className="coffee-cup"></div>
          <div className="blue-glow"></div>
        </div>
      </section>

      {/* SOFT SKILLS */}
      <div className="skills-section">
        <div className="skills-title">
          <h2>Kỹ năng mềm</h2>
          <p>
            Một số kỹ năng và trải nghiệm cá nhân tôi đã tích lũy
            trong quá trình học tập và làm việc.
          </p>
        </div>

        <div className="skills-grid">
          <div className="modern-skill-card">
            <div className="skill-emoji">🎬</div>
            <h3>Edit video cơ bản</h3>
            <span>CapCut chỉnh sửa video ngắn.</span>
          </div>

          <div className="modern-skill-card">
            <div className="skill-emoji">🎨</div>
            <h3>Design ảnh cơ bản</h3>
            <span>Canva, Photoshop cơ bản, thiết kế social media.</span>
          </div>

          <div className="modern-skill-card">
            <div className="skill-emoji">🗣️</div>
            <h3>Kỹ năng giao tiếp</h3>
            <span>Làm việc nhóm, tư vấn, hỗ trợ khách hàng.</span>
          </div>

          <div className="modern-skill-card">
            <div className="skill-emoji">⚡</div>
            <h3>Khả năng thích nghi</h3>
            <span>Tiếp cận nhanh môi trường và công nghệ mới.</span>
          </div>
        </div>
      </div>

      {/* MINI GAME */}
      <div className="minigame-box">
        <div className="minigame-left">
          <img
            src={minigameImg}
            alt="Mini Game"
            className="minigame-image"
          />
        </div>

        <div className="minigame-right">
          <h2>🎮 Mini Game</h2>
          <p>Giải trí nhẹ nhàng với khu vực mini game vui nhộn và hấp dẫn.</p>

          <button
            className="minigame-btn"
            onClick={() => {
              const username = localStorage.getItem("username");

              if (!username) {
                alert("Bạn cần đăng nhập để chơi!");
                navigate("/login");
                return;
              }

              navigate("/minigame");
            }}
          >
            🎮 Chơi ngay
          </button>
        </div>
      </div>

      {/* NEWS */}
      <div className="news-section">
        <h2>Tin mới</h2>

        <div className="news-grid">
          <a
            href="https://vnexpress.net"
            target="_blank"
            rel="noreferrer"
            className="news-card"
          >
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475"
              alt="news"
            />
            <div className="news-content">
              <h3>AI đang thay đổi ngành công nghệ toàn cầu</h3>
              <p>
                Trí tuệ nhân tạo đang bùng nổ mạnh mẽ, ảnh hưởng đến lập trình,
                thiết kế và kinh doanh.
              </p>
            </div>
          </a>

          <a
            href="https://cafef.vn"
            target="_blank"
            rel="noreferrer"
            className="news-card"
          >
            <img
              src="https://images.unsplash.com/photo-1559526324-593bc073d938"
              alt="trade"
            />
            <div className="news-content">
              <h3>Trade crypto tiếp tục biến động mạnh</h3>
              <p>
                Bitcoin và Altcoin xuất hiện nhiều đợt tăng giảm lớn, thu hút
                lượng lớn nhà đầu tư mới.
              </p>
            </div>
          </a>

          <a
            href="https://thanhnien.vn"
            target="_blank"
            rel="noreferrer"
            className="news-card"
          >
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="technology"
            />
            <div className="news-content">
              <h3>Xu hướng website AI cá nhân hóa người dùng</h3>
              <p>
                Các website hiện đại đang tích hợp AI hỗ trợ, giúp tăng trải
                nghiệm và giữ chân khách hàng.
              </p>
            </div>
          </a>
        </div>
      </div>
      {/* Nút Mtruong Tool */}
      <div className={`mtruong-tool-wrapper ${openTools ? "open" : ""}`}>
        {openTools && (
          <div className="mtruong-tool-menu">
            <button onClick={() => navigate("/auto-caption")}>
              📝 Auto Caption
            </button>

          </div>
        )}

        <div
          className="mtruong-tool-btn"
          onClick={() => setOpenTools(!openTools)}
        >
          <div className="mtruong-tool-icon">⚙️</div>
          <span>Mtruong Tool</span>
        </div>
      </div>
      {isFamily && (
        <div
          className="booking-food-btn"
          onClick={() => navigate("/booking-food")}
        >
          <div className="burger-icon">🍔</div>
          <span>Booking Food</span>
        </div>
      )}
      <section className="site-info-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.visits}</h3>
            <p>Lượt truy cập</p>
          </div>

          <div className="stat-card">
            <h3>{stats.contents}</h3>
            <p>Bài viết & nội dung</p>
          </div>

          <div className="stat-card">
            <h3>{stats.users}</h3>
            <p>Người dùng đăng ký</p>
          </div>

          <div className="stat-card">
            <h3>{stats.status}</h3>
            <p>Luôn sẵn sàng chia sẻ</p>
          </div>
        </div>

        <div className="personal-contact-card">
          <div>
            <span className="info-label">Liên hệ tôi</span>
            <h2>Mạnh Trường</h2>
            <p>
              Website cá nhân chia sẻ thơ, kiến thức hữu ích,
              công nghệ, AI và những trải nghiệm trong cuộc sống.
            </p>
          </div>

          <div className="social-links">
            <a href="https://facebook.com/nvmt2003" target="_blank" rel="noreferrer">
              Facebook
            </a>

            <a href="https://tiktok.com/@mtr6723" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=bottestserver004@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              Email
            </a>
          </div>
        </div>
      </section>
      <footer className="copyright">
        <img src={avatar1} alt="google" className="copyright-logo" />
        <span>© Copyright by MANHTRUONG</span>
      </footer>
    </div>
  );
}