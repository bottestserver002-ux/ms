import React from "react";
import Navbar from "../components/Navbar";
import owner from "../assets/owner.jpg";
import "./Profile.css";

export default function Profile() {
  return (
    <div className="container">
      <Navbar />

      <section className="profile-page">

        <div className="profile-left">
          <img
            src={owner}
            alt="Mạnh Trường"
            className="owner-image"
          />
        </div>

        <div className="profile-right">

          <span className="profile-tag">
            Người sáng lập
          </span>

          <h1>
            Mạnh Trường
          </h1>

          <h3>
            Người yêu công nghệ, sáng tạo và không ngừng học hỏi
          </h3>

          <p>
            Xin chào! Tôi là <strong>Mạnh Trường</strong>,
            người xây dựng và phát triển website này.
            Đây không chỉ là một nơi lưu giữ những vần thơ,
            kiến thức hữu ích hay những dự án cá nhân,
            mà còn là một góc nhỏ phản ánh hành trình trưởng thành,
            học tập và làm việc của chính tôi.
          </p>

          <p>
            Tôi luôn tin rằng công nghệ không chỉ để tạo ra sản phẩm,
            mà còn để lan tỏa giá trị và kết nối con người.
            Vì vậy, tôi không ngừng học hỏi, thử nghiệm những ý tưởng mới,
            từ lập trình web, trí tuệ nhân tạo, thiết kế nội dung,
            cho đến các giải pháp giúp công việc trở nên hiệu quả hơn.
          </p>

          <p>
            Bên cạnh niềm đam mê với công nghệ,
            tôi yêu thích viết lách, khám phá những góc nhìn tích cực
            về cuộc sống và chia sẻ những điều nhỏ bé nhưng hữu ích
            mỗi ngày. Tôi tin rằng sự tử tế, tinh thần cầu tiến
            và khả năng thích nghi chính là những yếu tố giúp chúng ta
            phát triển bền vững trong một thế giới luôn thay đổi.
          </p>

          <div className="profile-quote">
            <span>❝</span>
            <p>
              Mỗi ngày đều là một cơ hội để học thêm một điều mới,
              tạo ra một giá trị mới và trở thành phiên bản tốt hơn
              của chính mình.
            </p>
          </div>

        </div>

      </section>
    </div>
  );
}