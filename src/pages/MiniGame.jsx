import React, {
  useEffect,
  useState
} from "react";

import Navbar from "../components/Navbar";

import {
  getMiniGames,
  addMiniGame,
  deleteMiniGame,
  updateMiniGame
} from "../services/api";

import {
  useNavigate
} from "react-router-dom";

import "./minigame.css";

export default function MiniGame() {

  const navigate = useNavigate();

  const optimizeImage = (url) => {
    if (!url) return "";

    return url.replace(
      "/upload/",
      "/upload/c_fill,w_500,h_500,q_auto:good,f_auto,dpr_auto/"
    );
  };

  const isAdmin =
    localStorage.getItem("is_admin") === "true";

  const [questions, setQuestions] = useState([]);

  const [current, setCurrent] = useState(0);

  const [selected, setSelected] = useState([]);

  const [usedIndexes, setUsedIndexes] = useState([]);

  const [started, setStarted] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    image: "",
    answer: "",
  });

  useEffect(() => {

    const username =
      localStorage.getItem("username");

    if (!username) {

      navigate("/login");

      return;
    }

    fetchData();

  }, []);

  const fetchData = async () => {

    const data = await getMiniGames();

    setQuestions(data);
  };

  // =========================
  // LOADING
  // =========================

  if (!questions.length && !isAdmin) {

    return (
      <div className="container">
        <Navbar />
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 100
          }}
        >
          Đang tải...
        </h1>
      </div>
    );
  }

  // =========================
  // ADMIN VIEW
  // =========================

  if (isAdmin) {

    return (
      <div className="container">

        <Navbar />

        <div className="admin-game-box">

          <h1 className="game-title">
            ⚙ Quản lý Mini Game
          </h1>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.files[0],
              })
            }
          />

          <input
            placeholder="Đáp án"
            value={form.answer}
            onChange={(e) =>
              setForm({
                ...form,
                answer: e.target.value.toUpperCase(),
              })
            }
          />

          <button
            onClick={async () => {

              if (editingId) {

                await updateMiniGame(
                  editingId,
                  form.image,
                  form.answer
                );

                setEditingId(null);

              } else {

                await addMiniGame(
                  form.image,
                  form.answer
                );
              }

              fetchData();

              setForm({
                image: "",
                answer: "",
              });
            }}
          >
            {editingId
              ? "💾 Lưu chỉnh sửa"
              : "➕ Thêm câu hỏi"}
          </button>

          <div className="question-list">

            {questions.map((q) => (

              <div
                key={q.id}
                className="question-item"
              >

                <img
                  src={optimizeImage(q.image)}
                  alt=""
                  style={{
                    width: 120,
                    borderRadius: 10,
                    marginBottom: 10
                  }}
                />

                <h3>
                  {q.answer}
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10
                  }}
                >

                  <button
                    onClick={() => {

                      setEditingId(q.id);

                      setForm({
                        image: null,
                        answer: q.answer,
                      });
                    }}
                  >
                    ✏️ Sửa
                  </button>

                  <button
                    onClick={async () => {

                      await deleteMiniGame(q.id);

                      fetchData();
                    }}
                  >
                    ❌ Xóa
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // USER VIEW
  // =========================

  if (!started) {

    return (
      <div className="container">

        <Navbar />

        <div className="start-game-box">

          <h1 className="game-title">
            🎮 Đuổi hình bắt chữ
          </h1>

          <p className="game-desc">
            Quan sát hình ảnh và đoán đáp án nhé!
          </p>

          <button
            className="start-btn"
            onClick={() => setStarted(true)}
          >
            🚀 Bắt đầu chơi
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // GAME VIEW
  // =========================

  const q = questions[current];

  const answer =
    selected.join("");

  const isCorrect =
    answer === q.answer;

  const handleLetter = (letter, index) => {

    if (
      selected.length >= q.answer.length
    ) return;

    setSelected([
      ...selected,
      letter
    ]);

    setUsedIndexes([
      ...usedIndexes,
      index
    ]);
  };

  const resetAnswer = () => {

    setSelected([]);

    setUsedIndexes([]);
  };

  return (
    <div className="container">

      <Navbar />

      <div className="game-wrapper">

        <h1 className="game-title">
          🎮 Đuổi hình bắt chữ
        </h1>

        <img
          src={optimizeImage(q.image)}
          alt=""
          className="game-image"
        />

        <div className="answer-row">

          {q.answer.split("").map((_, i) => (

            <div
              key={i}
              className="answer-box"
            >
              {selected[i]}
            </div>

          ))}

        </div>

        <div className="letters-grid">

          {q.letters.map((l, i) => (

            <button
              key={i}
              disabled={
                usedIndexes.includes(i)
              }
              className="letter-btn"
              onClick={() =>
                handleLetter(l, i)
              }
            >
              {l}
            </button>

          ))}

        </div>

        {isCorrect && (

          <h2 className="correct-text">
            🎉 Chính xác!
          </h2>

        )}

        <div className="game-actions">

          <button
            onClick={resetAnswer}
          >
            Xóa
          </button>

          {isCorrect &&
            current <
            questions.length - 1 && (

              <button
                onClick={() => {

                  setCurrent(current + 1);

                  setSelected([]);

                  setUsedIndexes([]);
                }}
              >
                Câu tiếp →
              </button>

            )}

        </div>

      </div>

    </div>
  );
}