const API = "https://sm-backend-hbpp.onrender.com";

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

  const res = await fetch(
    `${API}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

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
/* =========================
   UPDATE / DELETE POEMS
========================= */

export const deletePoem = async (id) => {
  return fetch(`${API}/poems/${id}`, {
    method: "DELETE",
  });
};

export const updatePoem = async (id, data) => {
  return fetch(`${API}/poems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

/* =========================
   UPDATE / DELETE POSTS
========================= */

export const deletePost = async (id) => {
  return fetch(`${API}/posts/${id}`, {
    method: "DELETE",
  });
};

export const updatePost = async (id, data) => {
  return fetch(`${API}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
/* =========================
   MINIGAME
========================= */

// lấy danh sách câu hỏi
export const getMiniGames = async () => {

  const res = await fetch(
    `${API}/minigame`
  );

  return res.json();
};


// thêm câu hỏi + upload ảnh
export const addMiniGame = async (
  imageFile,
  answer
) => {

  const formData = new FormData();

  formData.append(
    "image",
    imageFile
  );

  formData.append(
    "answer",
    answer
  );

  return fetch(`${API}/minigame`, {
    method: "POST",
    body: formData,
  });
};


// sửa câu hỏi
export const updateMiniGame = async (
  id,
  imageFile,
  answer
) => {

  const formData = new FormData();

  formData.append(
    "image",
    imageFile
  );

  formData.append(
    "answer",
    answer
  );

  return fetch(
    `${API}/minigame/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );
};


// xóa câu hỏi
export const deleteMiniGame = async (
  id
) => {

  return fetch(
    `${API}/minigame/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return res.json();
};

export const resetPassword = async (data) => {
  const res = await fetch(`${API}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};