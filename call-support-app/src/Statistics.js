import React, { useEffect, useState } from "react";

const workerId = "worker1"; // Use actual user in production

function Statistics() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Fetch from your backend
    fetch(`http://localhost:4000/api/statistics?workerId=${workerId}`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Statistics</h1>
      {stats.length === 0 ? (
        <p>No statistics available.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", minWidth: 320 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}># Calls</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Avg Call Time (sec)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.date}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.date}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.callCount}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.avgCallTime.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Statistics;
