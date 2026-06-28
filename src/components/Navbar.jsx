import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    localStorage.getItem("avatar")
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateAvatar = () => {
      setUserAvatar(localStorage.getItem("avatar"));
    };

    window.addEventListener("storage", updateAvatar);
    window.addEventListener("avatarUpdated", updateAvatar);

    return () => {
      window.removeEventListener("storage", updateAvatar);
      window.removeEventListener("avatarUpdated", updateAvatar);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeMenu = () => setOpenMenu(false);

  return (
    <nav className="navbar">
      <div className={`navbar-inner ${scrolled ? "scrolled" : ""}`}>
        <div className="logo-left">
          <img src={logo} alt="logo" className="logo" />
        </div>

        <button
          className="menu-toggle"
          onClick={() => setOpenMenu(!openMenu)}
        >
          ☰
        </button>

        <div className={`menu nav-menu ${openMenu ? "active" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>Trang chủ</NavLink>
          <NavLink to="/collection" onClick={closeMenu}>Sưu tập</NavLink>
          <NavLink to="/useful" onClick={closeMenu}>Bổ ích</NavLink>
          <NavLink to="/minigame" onClick={closeMenu}>Minigame</NavLink>
          <NavLink to="/supports" onClick={closeMenu}>Hỏi AI</NavLink>
        </div>

        <div className="nav-right">
          {isAdmin && <span className="admin-text">ADMIN</span>}

          <div className="profile-wrapper">
            <button
              className="avatar-btn"
              onClick={() => setOpenProfile(!openProfile)}
            >
              <div className="default-avatar">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="avatar"
                    className="navbar-avatar-img"
                  />
                ) : (
                  username ? username.charAt(0).toUpperCase() : "U"
                )}
              </div>

              <span className="online-dot"></span>
            </button>

            {openProfile && (
              <div className="profile-menu">
                <Link
                  to="/user-profile"
                  onClick={() => setOpenProfile(false)}
                >
                  Thông tin cá nhân
                </Link>

                {username ? (
                  <button onClick={handleLogout}>Đăng xuất</button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpenProfile(false)}
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}