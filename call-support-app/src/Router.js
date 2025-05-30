import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Statistics from "./Statistics";

function App() {
  return (
    <Router>
      <nav style={{
        display: "flex",
        gap: "24px",
        background: "#f1f1f1",
        padding: "12px 24px",
        marginBottom: "24px"
      }}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">App</Link>
        <Link to="/statistics">Statistics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
