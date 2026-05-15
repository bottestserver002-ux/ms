import React from "react";
import Navbar from "../components/Navbar";

import avatar from "../assets/s.png";
import avatar1 from "../assets/gg.png";

const username = localStorage.getItem("username");

export default function Home() {
  return (
    <div className="container">

      <Navbar />

      {/* MAIN */}
      <div className="flex">

        {/* LEFT */}
        <div className="card intro">

          <h1>Lời giới thiệu</h1>

          <p>
            Xin chào! Đây là website cá nhân của tôi,
            nơi tôi chia sẻ những vần thơ, góc nhìn cuộc sống
            và các nội dung hữu ích mà tôi tâm huyết xây dựng.
          </p>

          <p>
            Hiện tôi đang là nhân viên tư vấn website tại công ty Nasani,
            vì vậy tôi luôn mong muốn mang đến những giá trị thiết thực
            và trải nghiệm tốt nhất cho người đọc.
          </p>

          <p>
            Dù website còn đơn giản và chưa có điều kiện đầu tư tên miền riêng,
            nhưng mọi nội dung đều được chăm chút với sự chân thành.
            Nếu bạn thấy thú vị, hãy thường xuyên ghé thăm nhé!
          </p>

        </div>

        {/* RIGHT */}
        <div className="card profile">

          <img
            src={avatar}
            alt="avatar"
            className="profile-img"
          />

          <h3>Nguyễn Văn Mạnh Trường</h3>
          <h3>Leader</h3>

        </div>

      </div>
      {/* NEWS */}
<div className="news-section">

  <h2>Tin mới</h2>

  <div className="news-grid">

    {/* CARD 1 */}
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
          Trí tuệ nhân tạo đang bùng nổ mạnh mẽ,
          ảnh hưởng đến lập trình, thiết kế và kinh doanh.
        </p>
      </div>
    </a>

    {/* CARD 2 */}
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
          Bitcoin và Altcoin xuất hiện nhiều đợt tăng giảm lớn,
          thu hút lượng lớn nhà đầu tư mới.
        </p>
      </div>
    </a>

    {/* CARD 3 */}
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
          Các website hiện đại đang tích hợp AI hỗ trợ,
          giúp tăng trải nghiệm và giữ chân khách hàng.
        </p>
      </div>
    </a>

  </div>

</div>

      {/* GOOGLE */}
      <div className="google">

        <img
          src={avatar1}
          alt="google"
        />

      </div>

    </div>
  );
} 