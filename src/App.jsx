import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Useful from "./pages/Useful";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Supports from "./pages/supports";
import PostDetail from "./pages/PostDetail";
import MiniGame from "./pages/MiniGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/useful" element={<Useful />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/supports" element={<Supports />} />
        <Route
          path="/minigame"
          element={<MiniGame />}
        />
        <Route
          path="/post/:id"
          element={<PostDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
