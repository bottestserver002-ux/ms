import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getPuzzleLevels,
    uploadPuzzleLevel,
    completePuzzleLevel,
} from "../services/api";
import "./puzzleGame.css";

export default function PuzzleGame() {
    const isAdmin = localStorage.getItem("is_admin") === "true";
    const email = localStorage.getItem("email") || "";

    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [tiles, setTiles] = useState([]);
    const [emptyIndexes, setEmptyIndexes] = useState([]);
    const [won, setWon] = useState(false);

    const [uploadLevel, setUploadLevel] = useState(1);
    const [uploadFile, setUploadFile] = useState(null);

    const optimizeImage = (url) => {
        if (!url) return "";

        return url.replace(
            "/upload/",
            "/upload/c_fill,w_500,h_500,q_auto:good,f_auto,dpr_auto/"
        );
    };

    const loadLevels = async () => {
        const data = await getPuzzleLevels(email);
        setLevels(data);
    };

    useEffect(() => {
        loadLevels();
    }, []);

    const shuffleTiles = (level) => {
        const total = level.rows * level.cols;

        const missing = [
            total - 1,
            total - 1 - level.cols,
        ];

        let arr = [];

        for (let i = 0; i < total; i++) {
            if (!missing.includes(i)) {
                arr.push(i);
            }
        }

        arr = arr.sort(() => Math.random() - 0.5);

        const board = Array(total).fill(null);

        let k = 0;

        for (let i = 0; i < total; i++) {
            if (missing.includes(i)) {
                board[i] = null;
            } else {
                board[i] = arr[k];
                k++;
            }
        }

        setTiles(board);
        setEmptyIndexes(missing);
        setWon(false);
    };
    const [selectedTile, setSelectedTile] = useState(null);
    const handleTileSelect = (index) => {
        if (won) return;
        setSelectedTile(index);
    };

    const handleEmptyClick = async (emptyIndex) => {
        if (selectedTile === null) return;

        if (!isNeighbor(selectedTile, emptyIndex)) {
            setSelectedTile(null);
            return;
        }

        await moveTile(selectedTile, emptyIndex);

        setSelectedTile(null);
    };
    const startLevel = (level) => {
        if (level.locked) {
            alert("Bạn cần hoàn thành màn trước để mở khóa!");
            return;
        }

        setCurrentLevel(level);
        shuffleTiles(level);
    };
    const [dragStart, setDragStart] = useState(null);

    const isNeighbor = (a, b) => {
        const cols = currentLevel.cols;

        const ar = Math.floor(a / cols);
        const ac = a % cols;

        const br = Math.floor(b / cols);
        const bc = b % cols;

        return (
            Math.abs(ar - br) + Math.abs(ac - bc) === 1
        );
    };

    const checkWin = (nextTiles) => {
        for (let i = 0; i < nextTiles.length; i++) {
            if (nextTiles[i] === null) continue;

            if (nextTiles[i] !== i) return false;
        }

        return true;
    };

    const moveTile = async (index, targetEmpty = null) => {
        if (won) return;

        const emptyNear =
            targetEmpty !== null
                ? targetEmpty
                : emptyIndexes.find((e) => isNeighbor(index, e));

        if (emptyNear === undefined || emptyNear === null) return;

        if (!isNeighbor(index, emptyNear)) return;

        const next = [...tiles];

        next[emptyNear] = next[index];
        next[index] = null;

        const newEmpty = emptyIndexes.map((e) =>
            e === emptyNear ? index : e
        );

        setTiles(next);
        setEmptyIndexes(newEmpty);

        if (checkWin(next)) {
            setWon(true);

            await completePuzzleLevel(email, currentLevel.level);

            loadLevels();
        }
    };
    const handlePointerDown = (e, index) => {
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            index,
        });
    };

    const handlePointerUp = (e, index) => {
        if (!dragStart || dragStart.index !== index) return;

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        const minDistance = 25;

        if (
            Math.abs(dx) < minDistance &&
            Math.abs(dy) < minDistance
        ) {
            setDragStart(null);
            return;
        }

        const direction =
            Math.abs(dx) > Math.abs(dy)
                ? dx > 0
                    ? "right"
                    : "left"
                : dy > 0
                    ? "down"
                    : "up";

        const cols = currentLevel.cols;

        const target =
            direction === "left"
                ? index - 1
                : direction === "right"
                    ? index + 1
                    : direction === "up"
                        ? index - cols
                        : index + cols;

        if (emptyIndexes.includes(target)) {
            moveTile(index, target);
        }

        setDragStart(null);
    };
    const handleUpload = async () => {
        if (!uploadFile) {
            alert("Vui lòng chọn ảnh!");
            return;
        }

        const data = await uploadPuzzleLevel(
            uploadLevel,
            uploadFile
        );

        alert(data.message || "Upload xong");
        setUploadFile(null);
        loadLevels();
    };

    if (isAdmin) {
        return (
            <div className="container">
                <Navbar />

                <div className="puzzle-page">
                    <h1>🧩 Quản lý Game Ghép Ảnh</h1>

                    <div className="puzzle-admin-box">
                        <label>Chọn Level</label>

                        <input
                            type="number"
                            min="1"
                            value={uploadLevel}
                            onChange={(e) =>
                                setUploadLevel(Number(e.target.value))
                            }
                        />

                        <label>Ảnh level</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setUploadFile(e.target.files[0])
                            }
                        />

                        <button onClick={handleUpload}>
                            ⬆ Upload ảnh level
                        </button>
                    </div>

                    <div className="puzzle-level-grid">
                        {levels.map((lv) => (
                            <div className="puzzle-level-card" key={lv.id}>
                                <img
                                    src={optimizeImage(lv.image)}
                                    alt=""
                                />

                                <h3>Level {lv.level}</h3>
                                <p>{lv.rows} x {lv.cols}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!currentLevel) {
        return (
            <div className="container">
                <Navbar />

                <div className="puzzle-page">
                    <h1>🧩 Game Ghép Ảnh</h1>
                    <p className="puzzle-desc">
                        Hoàn thành màn hiện tại để mở khóa màn tiếp theo.
                    </p>

                    <div className="puzzle-level-grid">
                        {levels.map((lv) => (
                            <div
                                className={
                                    lv.locked
                                        ? "puzzle-level-card locked"
                                        : "puzzle-level-card"
                                }
                                key={lv.id}
                            >
                                <img
                                    src={optimizeImage(lv.image)}
                                    alt=""
                                />

                                <h3>
                                    {lv.completed ? "✅" : "🧩"} Level {lv.level}
                                </h3>

                                <p>{lv.rows} x {lv.cols}</p>

                                <button onClick={() => startLevel(lv)}>
                                    {lv.locked ? "🔒 Đã khóa" : "▶ Chơi"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const rows = currentLevel.rows;
    const cols = currentLevel.cols;
    const total = rows * cols;

    return (
        <div className="container">
            <Navbar />

            <div className="puzzle-page">
                <div className="puzzle-top">
                    <button onClick={() => setCurrentLevel(null)}>
                        ← Chọn màn
                    </button>

                    <h1>Level {currentLevel.level}</h1>
                </div>

                <div
                    className={won ? "puzzle-board won" : "puzzle-board"}
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        aspectRatio: `${cols} / ${rows}`,
                    }}
                >
                    {tiles.map((tile, index) => {
                        if (tile === null) {
                            return (
                                <div
                                    key={index}
                                    className={
                                        won
                                            ? "puzzle-tile filled"
                                            : "puzzle-empty"
                                    }
                                    onClick={() => handleEmptyClick(index)}
                                    style={
                                        won
                                            ? {
                                                backgroundImage: `url(${optimizeImage(
                                                    currentLevel.image
                                                )})`,
                                                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                                                backgroundPosition: `${(index % cols) * (100 / (cols - 1))
                                                    }% ${Math.floor(index / cols) *
                                                    (100 / (rows - 1))
                                                    }%`,
                                            }
                                            : {}
                                    }
                                />
                            );
                        }

                        return (
                            <button
                                key={index}
                                className={
                                    selectedTile === index
                                        ? "puzzle-tile selected"
                                        : "puzzle-tile"
                                }
                                onClick={() => handleTileSelect(index)}
                                onPointerDown={(e) => handlePointerDown(e, index)}
                                onPointerUp={(e) => handlePointerUp(e, index)}
                                style={{
                                    backgroundImage: `url(${optimizeImage(currentLevel.image)})`,
                                    backgroundSize: `${cols * 100}% ${rows * 100}%`,
                                    backgroundPosition: `${(tile % cols) * (100 / (cols - 1))}% ${Math.floor(tile / cols) * (100 / (rows - 1))
                                        }%`,
                                }}
                            />
                        );
                    })}
                </div>

                {won && (
                    <div className="puzzle-win">
                        <h2>🎉 Hoàn thành Level {currentLevel.level}!</h2>

                        <button
                            onClick={() => {
                                const next = levels.find(
                                    (lv) => lv.level === currentLevel.level + 1
                                );

                                if (next) {
                                    startLevel({
                                        ...next,
                                        locked: false,
                                    });
                                } else {
                                    setCurrentLevel(null);
                                }
                            }}
                        >
                            Màn tiếp theo →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}