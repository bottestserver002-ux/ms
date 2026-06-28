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
import BookingFood from "./pages/BookingFood";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import AutoCaption from "./pages/AutoCaption";

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
        <Route path="/booking-food" element={<BookingFood />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/auto-caption" element={<AutoCaption />} />
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
