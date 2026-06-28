import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./AutoCaption.css";
import ReactMarkdown from "react-markdown";

export default function AutoCaption() {
    const API = "https://sm-backend-hbpp.onrender.com";

    const [form, setForm] = useState({
        topic: "",
        platform: "Facebook",
        goal: "Tăng tương tác",
        tone: "Thân thiện",
        length: "Trung bình",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [research, setResearch] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const createContent = async () => {
        if (!form.topic.trim()) {
            alert("Vui lòng nhập chủ đề!");
            return;
        }

        setLoading(true);
        setResult(null);

        let researchData = {
            google_suggest: [],
            google_trends: [],
        };

        try {
            const researchRes = await fetch(
                `${API}/seo/research?keyword=${encodeURIComponent(form.topic)}`
            );

            researchData = await researchRes.json();
            setResearch(researchData);
        } catch (error) {
            console.log("SEO research error:", error);
            setResearch(null);
        }

        try {
            const aiRes = await fetch(`${API}/auto-caption`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    google_suggest: researchData.google_suggest || [],
                    google_trends: researchData.google_trends || [],
                }),
            });

            const aiData = await aiRes.json();

            if (!aiRes.ok) {
                alert(aiData.detail || "Tạo nội dung thất bại!");
                setLoading(false);
                return;
            }

            setResult({
                aiText: aiData.result || "Không có nội dung trả về.",
            });
        } catch (error) {
            console.log("AI error:", error);
            alert("Lỗi kết nối AI!");
        }

        setLoading(false);
    };

    const copyResult = () => {
        if (!result?.aiText) return;

        navigator.clipboard.writeText(result.aiText);
        alert("Đã copy nội dung!");
    };

    const saveToLibrary = () => {
        if (!result) return;

        const saved = JSON.parse(
            localStorage.getItem("caption_library") || "[]"
        );

        saved.unshift({
            id: Date.now(),
            form,
            result,
            research,
            createdAt: new Date().toLocaleString("vi-VN"),
        });

        localStorage.setItem("caption_library", JSON.stringify(saved));
        alert("Đã lưu vào thư viện!");
    };

    return (
        <div className="container">
            <Navbar />

            <section className="auto-caption-page">
                <div className="auto-caption-header">
                    <span>✨ Mtruong Tool</span>

                    <h1>Auto Caption</h1>

                    <p>
                        Công cụ hỗ trợ tạo ý tưởng nội dung, caption viral,
                        bài viết chuyên nghiệp, hook mở đầu và hashtag nhanh chóng.
                    </p>
                </div>

                <div className="auto-caption-layout">
                    <div className="caption-form-card">
                        <h2>Nhập thông tin</h2>

                        <label>Chủ đề</label>
                        <input
                            className="topic-input"
                            name="topic"
                            value={form.topic}
                            onChange={handleChange}
                            placeholder="Ví dụ: Khóa đào tạo HLV Yoga 200H"
                        />

                        <label>Nền tảng</label>
                        <select
                            name="platform"
                            value={form.platform}
                            onChange={handleChange}
                        >
                            <option>Facebook</option>
                            <option>TikTok</option>
                            <option>Instagram</option>
                            <option>Website</option>
                        </select>

                        <label>Mục tiêu</label>
                        <select
                            name="goal"
                            value={form.goal}
                            onChange={handleChange}
                        >
                            <option>Tăng tương tác</option>
                            <option>Bán hàng</option>
                            <option>Xây thương hiệu</option>
                            <option>Viral</option>
                        </select>

                        <label>Văn phong</label>
                        <select
                            name="tone"
                            value={form.tone}
                            onChange={handleChange}
                        >
                            <option>Thân thiện</option>
                            <option>Chuyên nghiệp</option>
                            <option>Cảm xúc</option>
                            <option>Hài hước</option>
                            <option>Sang trọng</option>
                        </select>

                        <label>Độ dài</label>
                        <select
                            name="length"
                            value={form.length}
                            onChange={handleChange}
                        >
                            <option>Ngắn</option>
                            <option>Trung bình</option>
                            <option>Dài</option>
                        </select>

                        <button
                            className="generate-caption-btn"
                            onClick={createContent}
                            disabled={loading}
                        >
                            {loading ? "Đang tạo nội dung..." : "✨ Tạo nội dung"}
                        </button>

                        <div className="tool-types">
                            <span>✨ Gợi ý chủ đề</span>
                            <span>🔥 Caption Viral</span>
                            <span>📝 Bài viết SEO</span>
                            <span>🎬 Ý tưởng video/Reel</span>
                            <span>📈 Nghiên cứu từ khóa</span>
                            <span>#️⃣ Hashtag</span>
                        </div>
                    </div>

                    <div className="caption-result-card">
                        {!result ? (
                            <div className="empty-result">
                                <h2>Kết quả sẽ hiển thị tại đây</h2>

                                <p>
                                    Nhập chủ đề và bấm tạo nội dung để nhận gợi ý.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="result-actions">
                                    <button onClick={copyResult}>
                                        📋 Copy
                                    </button>

                                    <button onClick={saveToLibrary}>
                                        💾 Lưu vào thư viện
                                    </button>

                                    <button onClick={createContent}>
                                        🔄 Tạo lại
                                    </button>
                                </div>

                                {research && (
                                    <div className="result-block">
                                        <h3>📈 Nghiên cứu từ khóa</h3>

                                        <h4>Google Suggest</h4>

                                        {research.google_suggest?.length > 0 ? (
                                            <ul>
                                                {research.google_suggest.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Chưa có dữ liệu Google Suggest.</p>
                                        )}

                                        <h4>Google Trends</h4>

                                        {research.google_trends?.length > 0 ? (
                                            <ul>
                                                {research.google_trends.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Chưa có dữ liệu Google Trends.</p>
                                        )}
                                    </div>
                                )}

                                <div className="result-block">
                                    <h3>✨ Nội dung AI đề xuất</h3>

                                    <div className="markdown-content">
                                        <ReactMarkdown>
                                            {result?.aiText || ""}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}