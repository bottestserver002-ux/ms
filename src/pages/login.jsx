import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { motion } from "framer-motion";

import {
  login, register, forgotPassword,
  resetPassword
} from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(0);

  const [isRegister, setIsRegister] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [otp, setOtp] = useState("");

  const [isForgot, setIsForgot] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const sendOtp = async () => {

    if (!form.email) {

      alert("Vui lòng nhập email trước");

      return;
    }
    console.log("Đang gửi OTP...");
    console.log("Email:", form.email);

    try {

      const res = await fetch(
        `https://sm-backend-hbpp.onrender.com/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
          }),
        }
      );
      console.log("Status:", res.status);

      const data = await res.json();
      console.log("Response:", data);

      alert(data.message);

      if (res.ok) {
        setOtpSent(true);
        setCountdown(180); // 3 phút
      }

    } catch (err) {

      console.log(err);

      alert("Không gửi được OTP");

    }
  };

  const sendForgotOtp = async () => {

    if (!form.email) {
      alert("Vui lòng nhập email");
      return;
    }

    try {

      const data = await forgotPassword(
        form.email
      );

      alert(data.message);

      setOtpSent(true);

      setCountdown(180);

    } catch (err) {

      console.log(err);

      alert("Không gửi được OTP");

    }
  };

  const handleSubmit = async () => {

    try {
      if (isForgot) {

        const data = await resetPassword({
          email: form.email,
          otp,
          password: newPassword
        });

        alert(data.message);

        if (
          data.message?.includes("thành công")
        ) {

          setIsForgot(false);

          setOtp("");

          setNewPassword("");

          setOtpSent(false);

        }

        return;
      }

      if (isRegister) {

        const data = await register({
          ...form,
          otp,
        });

        alert(data.message || data.detail || "Có lỗi xảy ra");

        if (
          data.message?.includes("thành công")
        ) {

          setIsRegister(false);

          setOtp("");

          setOtpSent(false);

          setForm({
            username: "",
            email: "",
            password: "",
          });

        }

      } else {

        const data = await login(form);

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem("user_id", data.user.id);

        localStorage.setItem(
          "is_admin",
          data.user.is_admin
        );

        localStorage.setItem(
          "is_family",
          data.user.is_family
        );

        localStorage.setItem(
          "username",
          data.user.username
        );

        localStorage.setItem(
          "email",
          data.user.email
        );


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
        initial={{
          opacity: 0,
          y: 50
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.8
        }}
      >

        <h1>
          {
            isForgot
              ? "Quên mật khẩu"
              : isRegister
                ? "Đăng ký tài khoản"
                : "Đăng nhập hệ thống"
          }
        </h1>

        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Tên người dùng"
            value={form.username}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {!isForgot && (
          <input
            autoComplete="off"
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        )}

        {/* OTP ĐĂNG KÝ */}

        {isRegister && (
          <div className="otp-container">

            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <button
              type="button"
              onClick={sendOtp}
              disabled={countdown > 0}
              className="otp-btn"
            >
              {
                countdown > 0
                  ? `${Math.floor(
                    countdown / 60
                  )}:${String(
                    countdown % 60
                  ).padStart(2, "0")}`
                  : "Gửi"
              }
            </button>

          </div>
        )}

        {/* QUÊN MẬT KHẨU */}

        {isForgot && (
          <>
            <div className="otp-container">

              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
              />

              <button
                type="button"
                onClick={sendForgotOtp}
                disabled={countdown > 0}
                className="otp-btn"
              >
                {
                  countdown > 0
                    ? `${Math.floor(
                      countdown / 60
                    )}:${String(
                      countdown % 60
                    ).padStart(2, "0")}`
                    : "Gửi"
                }
              </button>

            </div>

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </>
        )}

        {/* ĐĂNG NHẬP */}



        {(isRegister || isForgot) &&
          otpSent && (
            <p className="otp-info">
              Mã OTP đã được gửi tới email
              của bạn. Nếu chưa nhận được,
              vui lòng chờ{" "}
              {Math.floor(
                countdown / 60
              )}
              :
              {String(
                countdown % 60
              ).padStart(2, "0")}
              để gửi lại.
            </p>
          )}

        <button
          onClick={handleSubmit}
        >
          {
            isForgot
              ? "Đổi mật khẩu"
              : isRegister
                ? "Đăng ký"
                : "Đăng nhập"
          }
        </button>

        {!isRegister && !isForgot && (
          <p
            className="forgot-password"
            onClick={() => {

              setIsForgot(true);

              setIsRegister(false);

              setOtp("");

              setOtpSent(false);
              setCountdown(0);

              setForm({
                username: "",
                email: "",
                password: "",
              });

            }}
          >
            Quên mật khẩu?
          </p>
        )}

        <p>
          {
            isForgot
              ? "Nhớ mật khẩu rồi?"
              : isRegister
                ? "Đã có tài khoản?"
                : "Chưa có tài khoản?"
          }
        </p>

        <span
          style={{
            cursor: "pointer"
          }}
          onClick={() => {

            if (isForgot) {

              setIsForgot(false);

              setOtp("");

              setNewPassword("");

              setOtpSent(false);

              setCountdown(0);

              setForm({
                username: "",
                email: "",
                password: "",
              });

              return;
            }

            setIsRegister(
              !isRegister
            );

            setOtp("");

            setOtpSent(false);

          }}
        >
          {
            isForgot
              ? "Quay lại đăng nhập"
              : isRegister
                ? "Đăng nhập"
                : "Đăng ký ngay"
          }
        </span>

      </motion.div>

    </div>
  );
}