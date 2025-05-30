import React, { useState, useEffect } from 'react';

const workerId = 'worker1'; // Hardcoded for demo; in reality, you'd have auth

function chunkRowWise(arr, chunkSize) {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

function App() {
  const [onCall, setOnCall] = useState(false);
  const [calls, setCalls] = useState([]);
  const [stats, setStats] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');


  useEffect(() => {
    fetchCalls();
    fetchStats();
  }, []);

  const fetchCalls = async () => {
    const res = await fetch(`http://localhost:4000/api/calls?workerId=${workerId}`);
    const data = await res.json(); // Only call res.json() ONCE!
    setCalls(data);
    const ongoing = data.some(c => !c.end);
    setOnCall(ongoing);
  };
  

  const fetchStats = async () => {
    const res = await fetch(`http://localhost:4000/api/statistics?workerId=${workerId}`);
    setStats(await res.json());
  };

  const startCall = async () => {
    await fetch('http://localhost:4000/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId }),
    });
    setOnCall(true);
    fetchCalls();
    fetchStats();
  };

  const stopCall = async () => {
    await fetch('http://localhost:4000/api/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId }),
    });
    setOnCall(false);
    fetchCalls();
    fetchStats();
  };

  const deleteCall = async () => {
    setDeleteMsg('');
    if (!deleteId) return setDeleteMsg('Please enter a Call ID.');
    const res = await fetch('http://localhost:4000/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callId: deleteId }),
    });
    if (res.ok) {
      setDeleteMsg('Call deleted.');
      setDeleteId('');
      fetchCalls();
      fetchStats();
    } else {
      const { error } = await res.json();
      setDeleteMsg(error || 'Failed to delete call.');
    }
  };
  

  const cellHeight = 120; // px, adjust as needed
  const maxRows = Math.max(1, Math.floor(window.innerHeight * 0.7 / cellHeight));
  const todaysCalls = calls.filter(c => c.date === new Date().toISOString().slice(0,10));
  const rows = chunkRowWise(todaysCalls, maxRows);
  

  return (
    <div style={{ padding: 24 }}>
      <h1>Call Support Dashboard</h1>
      <div>
        {!onCall ? (
          <button onClick={startCall}>Start Call</button>
        ) : (
          <button onClick={stopCall}>Stop Call</button>
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <input
          type="number"
          placeholder="Call ID to delete"
          value={deleteId}
          onChange={e => setDeleteId(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={deleteCall}>Delete Call</button>
        {deleteMsg && (
          <span style={{ marginLeft: 8, color: deleteMsg === 'Call deleted.' ? 'green' : 'red' }}>
            {deleteMsg}
          </span>
        )}
      </div>

      <h2>Today's Calls</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((c, cIdx) => c ? (
                <td
                  key={cIdx}
                  style={{ border: '1px solid #ccc', padding: 12, minWidth: 200, verticalAlign: 'top' }}
                >
                  <div>
                    <strong>Call #{c.id}</strong><br />
                    Start: {new Date(c.start).toLocaleTimeString()}<br />
                    End: {c.end ? new Date(c.end).toLocaleTimeString() : "Ongoing"}<br />
                    Duration: {c.end ?
                      (() => {
                        const seconds = (new Date(c.end) - new Date(c.start)) / 1000;
                        const mins = Math.floor(seconds / 60);
                        const secs = Math.floor(seconds % 60);
                        return `${mins > 0 ? mins + "m " : ""}${secs}s`;
                      })()
                      : "—"
                    }
                  </div>
                </td>
              ) : (
                <td key={cIdx} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;