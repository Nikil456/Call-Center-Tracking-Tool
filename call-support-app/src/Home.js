import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function Home() {
  return (
    <div className="home-center">
      <h1>Welcome to the Call Center Support Tool</h1>
      <p>This tool lets call support workers track their calls, view statistics, and manage call data.</p>
      <div>
        <Link to="/dashboard">
          <button>Go to App</button>
        </Link>
        <Link to="/statistics" style={{ marginLeft: 16 }}>
          <button>View Statistics</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;