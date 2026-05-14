const API = "http://localhost:8000";

/* =========================
   POEMS
========================= */

export const getPoems = async () => {
  const res = await fetch(`${API}/poems`);
  return res.json();
};

export const addPoem = async (data) => {
  return fetch(`${API}/poems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

/* =========================
   POSTS
========================= */

export const getPosts = async () => {
  const res = await fetch(`${API}/posts`);
  return res.json();
};

/* =========================
   AUTH
========================= */

export const login = async (data) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const register = async (data) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* =========================
   AI SUPPORT
========================= */

export const askAI = async (message) => {
  const res = await fetch(`${API}/ask-ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
};
export const addPost = async (data) => {
  return fetch(`${API}/posts`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
};