import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import minigameImg from "../assets/minigame.png";
import minigame2048Img from "../assets/2048.png";
import minigameGhepanh from "../assets/ghep-anh.png";
import "./minigameHome.css";

export default function MiniGameHome() {
  const navigate = useNavigate();

  const games = [
    {
      title: "Đuổi hình bắt chữ",
      desc: "Quan sát hình ảnh và đoán đáp án thật nhanh.",
      image: minigameImg,
      path: "/minigame/duoi-hinh-bat-chu",
    },
    {
      title: "2048",
      desc: "Gộp các ô số giống nhau để đạt điểm cao nhất.",
      image: minigame2048Img,
      path: "/minigame/2048",
    },
    {
      title: "Ghép ảnh",
      desc: "Trượt các mảnh ghép để hoàn thành bức ảnh.",
      image: minigameGhepanh,
      path: "/minigame/ghep-anh",
    }
  ];

  return (
    <div className="container">
      <Navbar />

      <section className="mini-home">
        <div className="mini-home-header">
          <span>🎮 MTRUONG GAME</span>
          <h1>Mini Game</h1>
          <p>Chọn trò chơi bạn muốn trải nghiệm.</p>
        </div>

        <div className="mini-game-grid">
          {games.map((game, index) => (
            <div className="mini-game-card" key={index}>
              <img src={game.image} alt={game.title} />

              <div className="mini-game-content">
                <h3>{game.title}</h3>
                <p>{game.desc}</p>

                <button
                  disabled={game.comingSoon}
                  onClick={() => {
                    if (!game.comingSoon) {
                      navigate(game.path);
                    }
                  }}
                >
                  {game.comingSoon ? "Sắp ra mắt" : "Chơi ngay"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}