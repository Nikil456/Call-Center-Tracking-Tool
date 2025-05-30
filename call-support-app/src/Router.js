import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Statistics from "./Statistics";
import './style.css';
import { NavLink } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav>
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/dashboard" className="nav-link">
          App
        </NavLink>
        <NavLink to="/statistics" className="nav-link">
          Statistics
        </NavLink>
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
