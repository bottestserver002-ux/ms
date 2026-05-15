import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { motion } from "framer-motion";

import { login, register } from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {

    try {

      if (isRegister) {

        const data = await register(form);

        alert(data.message);

        setIsRegister(false);

      } else {

        const data = await login(form);

      localStorage.setItem("token", data.token);
localStorage.setItem("is_admin", data.is_admin);
localStorage.setItem("username", data.username);
localStorage.setItem("email", data.email);

        navigate("/");
      }

    } catch (err) {

      console.log(err);

      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="login-page">

      <button
        className="home-btn"
        onClick={() => navigate("/")}
      >
        ← Trang chủ
      </button>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <h1>
          {
            isRegister
            ? "Đăng ký tài khoản"
            : "Đăng nhập hệ thống"
          }
        </h1>

        {
          isRegister && (
            <input
              type="text"
              name="username"
              placeholder="Tên người dùng"
              onChange={handleChange}
            />
          )
        }

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {
            isRegister
            ? "Đăng ký"
            : "Đăng nhập"
          }
        </button>

        <p>
          {
            isRegister
            ? "Đã có tài khoản?"
            : "Chưa có tài khoản?"
          }
        </p>

        <span
          onClick={() =>
            setIsRegister(!isRegister)
          }
        >
          {
            isRegister
            ? "Đăng nhập"
            : "Đăng ký ngay"
          }
        </span>

      </motion.div>
    </div>
  );
}