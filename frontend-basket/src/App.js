import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BasketPage from "./BasketPage";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "20px", background: "#222", color: "white" }}>
        <Link to="/basket" style={{ color: "white" }}>
          Basket
        </Link>
      </nav>

      <Routes>
        <Route path="/basket" element={<BasketPage />} />
      </Routes>
    </Router>
  );
}
