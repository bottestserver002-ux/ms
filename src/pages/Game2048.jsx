import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./game2048.css";

const SIZE = 4;

function emptyBoard() {
  return Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(0));
}

function addRandomTile(board) {
  const empty = [];

  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c]);
    });
  });

  if (empty.length === 0) return board;

  const newBoard = board.map((row) => [...row]);
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];

  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;

  return newBoard;
}

function startBoard() {
  let board = emptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function slide(row) {
  const arr = row.filter((n) => n !== 0);
  let gained = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      gained += arr[i];
      arr[i + 1] = 0;
    }
  }

  const merged = arr.filter((n) => n !== 0);

  while (merged.length < SIZE) {
    merged.push(0);
  }

  return {
    row: merged,
    gained,
  };
}

function rotate(board) {
  const result = emptyBoard();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      result[c][SIZE - 1 - r] = board[r][c];
    }
  }

  return result;
}

function boardsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function moveBoard(board, direction) {
  let work = board.map((row) => [...row]);

  if (direction === "up") work = rotate(rotate(rotate(work)));
  if (direction === "right") work = rotate(rotate(work));
  if (direction === "down") work = rotate(work);

  let gained = 0;

  work = work.map((row) => {
    const result = slide(row);
    gained += result.gained;
    return result.row;
  });

  if (direction === "up") work = rotate(work);
  if (direction === "right") work = rotate(rotate(work));
  if (direction === "down") work = rotate(rotate(rotate(work)));

  if (boardsEqual(board, work)) {
    return {
      board,
      gained: 0,
      moved: false,
    };
  }

  return {
    board: addRandomTile(work),
    gained,
    moved: true,
  };
}

function isGameOver(board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return false;

      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) {
        return false;
      }

      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

export default function Game2048() {
  const [board, setBoard] = useState(startBoard());
  const [score, setScore] = useState(0);

  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("best_2048")) || 0
  );

  const gameOver = isGameOver(board);
  const maxTile = Math.max(...board.flat());

  const resetGame = () => {
    setBoard(startBoard());
    setScore(0);
  };

  const move = (direction) => {
    if (gameOver) return;

    const result = moveBoard(board, direction);

    if (!result.moved) return;

    const nextBoard = result.board;
    const gained = result.gained;

    setBoard(nextBoard);

    setScore((oldScore) => {
      const newScore = oldScore + gained;

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("best_2048", newScore);
      }

      return newScore;
    });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        move("up");
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        move("down");
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move("left");
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        move("right");
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [board, gameOver, bestScore]);

  return (
    <div className="container">
      <Navbar />

      <div className="game2048-page">
        <div className="game2048-header">
          <span>🎮 Mini Game</span>

          <h1>2048</h1>

          <p>
            Gộp các ô giống nhau để đạt điểm cao nhất.
            Không giới hạn ở 2048, chơi đến khi hết nước đi.
          </p>
        </div>

        <div className="game2048-top">
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div className="score-box">
              <span>Điểm</span>
              <strong>{score}</strong>
            </div>

            <div className="score-box">
              <span>Kỷ lục</span>
              <strong>{bestScore}</strong>
            </div>

            <div className="score-box">
              <span>Ô lớn nhất</span>
              <strong>{maxTile}</strong>
            </div>
          </div>

          <button onClick={resetGame}>🔄 Chơi lại</button>
        </div>

        <div className="board2048">
          {board.flat().map((num, index) => (
            <div key={index} className={`tile tile-${num}`}>
              {num !== 0 ? num : ""}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="game-over-box">
            <h2>💀 Game Over</h2>
            <p>Bạn đã hết nước đi. Bấm chơi lại để bắt đầu ván mới.</p>
          </div>
        )}

        <div className="mobile-controls">
          <button onClick={() => move("up")}>⬆</button>

          <div>
            <button onClick={() => move("left")}>⬅</button>
            <button onClick={() => move("down")}>⬇</button>
            <button onClick={() => move("right")}>➡</button>
          </div>
        </div>
      </div>
    </div>
  );
}