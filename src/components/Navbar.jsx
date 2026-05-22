import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {

  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav>

      {/* LOGO */}
      <img
        src={logo}
        alt="logo"
        className="logo"
      />

      {/* MENU */}
      <div className="menu">

        <Link to="/">Trang chủ</Link>

        <Link to="/collection">Sưu tập</Link>

        <Link to="/useful">Bổ ích</Link>

        <Link to="/contact">Liên hệ</Link>

        <Link to="/supports">Hỏi AI</Link>

        {/* AUTH AREA */}
        {
          username ? (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

              <span style={{ color: "#2563eb", fontWeight: "bold" }}>
                Xin chào, {username}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Đăng xuất
              </button>

            </div>
          ) : (
            <Link to="/login">
              Đăng nhập / Đăng ký
            </Link>
          )
        }

      </div>

    </nav>
  );
}