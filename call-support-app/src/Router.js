import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Statistics from './Statistics';
import Login from './Login';
import Register from './Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:4000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const requireAuth = (element) => {
    return user ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <nav>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/dashboard" className="nav-link">App</NavLink>
        <NavLink to="/statistics" className="nav-link">Statistics</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/dashboard" element={requireAuth(<Dashboard user={user} />)} />
        <Route path="/statistics" element={requireAuth(<Statistics user={user} />)} />
      </Routes>
    </Router>
  );
}

export default App;
