import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to the Call Center Support Tool</h1>
      <p>This tool lets call support workers track their calls, view statistics, and manage call data.</p>
      <div style={{ marginTop: 24 }}>
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