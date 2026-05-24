import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {

  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {

  const handleScroll = () => {

    if (window.scrollY > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };

}, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* NAVBAR CONTAINER */}
      <div className={`navbar-inner ${scrolled ? "scrolled" : ""}`}>

        {/* MOBILE BUTTON */}
        <button
          className="menu-toggle"
          onClick={() => setOpenMenu(!openMenu)}
        >
          ☰
        </button>

        {/* LEFT MENU */}
        <div className={`menu left-menu ${openMenu ? "active" : ""}`}>

          <Link to="/">Trang chủ</Link>

          <Link to="/collection">Sưu tập</Link>

          <Link to="/useful">Bổ ích</Link>

        </div>

        {/* LOGO */}
        <div className="logo-center">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />
        </div>

        {/* RIGHT MENU */}
        <div className={`menu right-menu ${openMenu ? "active" : ""}`}>

          <Link to="/contact">Liên hệ</Link>

          <Link to="/supports">Hỏi AI</Link>

          {
            username ? (
              <div className="auth-box">

                <span className="hello-text">
                  {username}
                </span>

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Đăng xuất
                </button>

              </div>
            ) : (
              <Link to="/login">
                Đăng nhập
              </Link>
            )
          }

        </div>

      </div>

    </nav>
  );
}