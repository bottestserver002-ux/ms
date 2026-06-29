import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import "./AutoCaption.css";

export default function AutoCaption() {
    const API = "https://sm-backend-hbpp.onrender.com";

    const [form, setForm] = useState({
        topic: "",
        platform: "Facebook",
        goal: "Tăng tương tác",
        tone: "Thân thiện",
        length: "Trung bình",
        // mới
        postLength: "Tự động",
    });
    const [tiktokLoading, setTiktokLoading] =
        useState(false);

    const [tiktokResult, setTiktokResult] =
        useState("");

    const [blogLoading, setBlogLoading] = useState(false);
    const [blogResult, setBlogResult] = useState("");

    const generateTikTok = async () => {

        if (!selectedIdea) {
            alert("Vui lòng chọn chủ đề!");
            return;
        }

        setTiktokLoading(true);

        try {

            const res = await fetch(
                `${API}/generate-tiktok`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        main_subject: form.topic,

                        selected_idea_number:
                            selectedIdea,

                        ideas_text:
                            result.aiText,

                        tone:
                            form.tone,
                    }),
                }
            );

            const data =
                await res.json();

            setTiktokResult(
                data.result
            );

        } catch (err) {

            alert(err.message);

        } finally {

            setTiktokLoading(false);
        }
    };

    const generateBlog = async () => {
        if (!selectedIdea) {
            alert("Vui lòng chọn chủ đề!");
            return;
        }

        setBlogLoading(true);

        try {
            const res = await fetch(
                `${API}/generate-blog`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        main_subject: form.topic,

                        selected_idea_number: selectedIdea,

                        ideas_text: result.aiText,

                        tone: form.tone,

                        length: form.length,
                    }),
                }
            );

            const data = await res.json();

            setBlogResult(data.result);

        } catch (err) {

            alert(err.message);

        } finally {

            setBlogLoading(false);
        }
    };

    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);

    const [result, setResult] = useState(null);
    const [research, setResearch] = useState(null);

    const [selectedIdea, setSelectedIdea] = useState("");
    const [postResult, setPostResult] = useState(null);

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
        setPostResult(null);
        setSelectedIdea("");

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

    const generateFacebookPost = async () => {
        if (!selectedIdea) {
            alert("Vui lòng chọn một chủ đề từ 1 đến 20!");
            return;
        }

        if (!result?.aiText) {
            alert("Bạn cần tạo 20 chủ đề trước!");
            return;
        }

        setPostLoading(true);
        setPostResult(null);

        try {
            const res = await fetch(`${API}/generate-post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    main_subject: form.topic,
                    selected_idea_number: selectedIdea,
                    ideas_text: result.aiText,
                    tone: form.tone,
                    platform: form.platform,
                    goal: form.goal,
                    post_length: form.postLength,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.detail || "Tạo bài viết thất bại!");
                setPostLoading(false);
                return;
            }

            setPostResult(data.result || "Không có nội dung trả về.");
        } catch (error) {
            console.log("Generate post error:", error);
            alert("Lỗi kết nối AI khi tạo Facebook Post!");
        }

        setPostLoading(false);
    };

    const copyResult = () => {
        if (!result?.aiText && !postResult) return;

        const text = `
${result?.aiText || ""}

${postResult ? "\n\nFACEBOOK POST ĐÃ TẠO:\n" + postResult : ""}
    `.trim();

        navigator.clipboard.writeText(text);
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
            selectedIdea,
            postResult,
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
                        Công cụ hỗ trợ phân tích insight, tạo 20 ý tưởng chủ đề viral,
                        sau đó chọn một chủ đề để viết Facebook Post và gợi ý hình ảnh.
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
                            {loading ? "Đang tạo 20 chủ đề..." : "✨ Tạo nội dung"}
                        </button>

                        <div className="tool-types">
                            <span>💡 Insight khách hàng</span>
                            <span>🔥 20 chủ đề viral</span>
                            <span>📈 Nghiên cứu từ khóa</span>
                            <span>📝 Facebook Post</span>
                            <span>🖼️ Gợi ý hình ảnh</span>
                            <span>#️⃣ Hashtag</span>
                        </div>
                    </div>

                    <div className="caption-result-card">
                        {!result ? (
                            <div className="empty-result">
                                <h2>Kết quả sẽ hiển thị tại đây</h2>

                                <p>
                                    Nhập chủ đề và bấm tạo nội dung để nhận insight
                                    cùng 20 ý tưởng chủ đề.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="result-actions">
                                    <button onClick={copyResult}>📋 Copy</button>

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
                                    </div>
                                )}

                                <div className="result-block">
                                    <h3>✨ Insight & 20 ý tưởng chủ đề</h3>

                                    <div className="markdown-content">
                                        <ReactMarkdown>
                                            {result?.aiText || ""}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                <label className="select-topic-label">
                                    Chọn chủ đề từ 1 đến 20
                                </label>

                                <select
                                    className="select-topic-box"
                                    value={selectedIdea}
                                    onChange={(e) => setSelectedIdea(e.target.value)}
                                >
                                    <option value="">-- Chọn chủ đề --</option>

                                    {Array.from({ length: 20 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            Chủ đề {i + 1}
                                        </option>
                                    ))}
                                </select>
                                {/* FACEBOOK POST */}
                                <div className="result-block">
                                    <h3>📝 Tạo Facebook Post từ chủ đề đã chọn</h3>


                                    <div className="post-length-group">
                                        <label>Độ dài Facebook Post</label>

                                        <select
                                            name="postLength"
                                            value={form.postLength}
                                            onChange={handleChange}
                                        >
                                            <option value="Tự động">
                                                🔥 Tự động tối ưu theo nền tảng
                                            </option>

                                            <option value="Rất ngắn">
                                                ⚡ Rất ngắn (80-150 từ)
                                            </option>

                                            <option value="Ngắn">
                                                ✍️ Ngắn (150-300 từ)
                                            </option>

                                            <option value="Trung bình">
                                                📝 Trung bình (300-600 từ)
                                            </option>

                                            <option value="Dài">
                                                📖 Dài (600-1000 từ)
                                            </option>

                                            <option value="SEO">
                                                🔍 Chuẩn SEO (1000-1500 từ)
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        className="generate-post-btn"
                                        onClick={generateFacebookPost}
                                        disabled={postLoading}
                                    >
                                        {postLoading
                                            ? "Đang tạo Facebook Post..."
                                            : "✨ Tạo Facebook Post"}
                                    </button>
                                </div>
                                {/* BLOG SEO WEBSITE */}
                                <div className="generate-blog-box">
                                    <h3>
                                        🌐 Tạo Blog SEO Website từ chủ đề đã chọn
                                    </h3>

                                    <p>
                                        Tự động sinh:
                                    </p>

                                    <ul>
                                        <li>✅ Tiêu đề SEO</li>
                                        <li>✅ Meta Description</li>
                                        <li>✅ URL Slug</li>
                                        <li>✅ Từ khóa chính & phụ</li>
                                        <li>✅ Search Intent</li>
                                        <li>✅ Internal Link</li>
                                        <li>✅ FAQ Schema</li>
                                        <li>✅ Gợi ý hình ảnh</li>
                                        <li>✅ Bài viết 1200–1800 từ</li>
                                    </ul>

                                    <button
                                        onClick={generateBlog}
                                        disabled={blogLoading}
                                    >
                                        {
                                            blogLoading
                                                ? "Đang tạo..."
                                                : "🌐 Tạo Blog SEO"
                                        }
                                    </button>
                                </div>
                                {/* TIKTOK */}
                                <div className="generate-tiktok-box">
                                    <h3>🎬 Tạo Post TikTok Viral</h3>

                                    <button
                                        onClick={generateTikTok}
                                        disabled={tiktokLoading}
                                    >
                                        {tiktokLoading
                                            ? "Đang tạo..."
                                            : "🎬 Tạo TikTok Viral"}
                                    </button>
                                </div>


                                {postResult && (
                                    <div className="result-block">
                                        <h3>📌 Facebook Post & gợi ý hình ảnh</h3>

                                        <div className="markdown-content">
                                            <ReactMarkdown>
                                                {postResult}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}


                                {
                                    blogResult && (

                                        <div className="blog-result-card">

                                            <h2>
                                                🌐 Blog SEO Website
                                            </h2>

                                            <div className="markdown-content">
                                                <ReactMarkdown>
                                                    {blogResult}
                                                </ReactMarkdown>
                                            </div>
                                        </div>

                                    )

                                }
                                {
                                    tiktokResult && (

                                        <div className="tiktok-result-card">

                                            <h2>
                                                🎬 TikTok Viral
                                            </h2>

                                            <div className="markdown-content">
                                                <ReactMarkdown>
                                                    {tiktokResult}
                                                </ReactMarkdown>
                                            </div>

                                        </div>

                                    )
                                }

                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}