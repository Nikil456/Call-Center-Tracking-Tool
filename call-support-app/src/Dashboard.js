import React, { useState, useEffect } from 'react';
import './style.css';

function getDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function dateToString(date) {
  return date.toISOString().slice(0, 10);
}

function chunkRowWise(arr, chunkSize) {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

function Dashboard({ user }) {
  const [onCall, setOnCall] = useState(false);
  const [calls, setCalls] = useState([]);
  const [stats, setStats] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  const today = new Date();
  const todayString = dateToString(today);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(dateToString(today));

  const daysInMonth = getDaysInMonth(year, month);
  const viewingToday = selectedDate === todayString;
  const callsForDay = calls.filter(c => c.date === selectedDate);

  const cellHeight = 120;
  const maxRows = Math.max(1, Math.floor(window.innerHeight * 0.7 / cellHeight));
  const rows = chunkRowWise(callsForDay, maxRows);

  useEffect(() => {
    if (user) {
      fetchCalls();
      fetchStats();
    }
  }, [user]);

  const fetchCalls = async () => {
    const res = await fetch(`http://localhost:4000/api/calls?userId=${user.id}`);
    const data = await res.json();
    setCalls(data);
    const ongoing = data.some(c => !c.end && c.date === todayString);
    setOnCall(ongoing);
  };

  const fetchStats = async () => {
    const res = await fetch(`http://localhost:4000/api/statistics?userId=${user.id}`);
    setStats(await res.json());
  };

  const startCall = async () => {
    await fetch('http://localhost:4000/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    setOnCall(true);
    fetchCalls();
    fetchStats();
  };

  const stopCall = async () => {
    await fetch('http://localhost:4000/api/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
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
      body: JSON.stringify({ callId: deleteId, userId: user.id }),
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

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(dateToString(new Date(newYear, newMonth, 1)));
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(dateToString(new Date(newYear, newMonth, 1)));
  };

  const goToCurrentMonth = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setSelectedDate(dateToString(today));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 className="dashboard-heading">Call Support Dashboard</h1>

      <div className="month-nav">
        <button className="month-arrow-btn" onClick={handlePrevMonth}>
          &#8592;
        </button>
        <h2 className="month-heading">
          {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button className="month-arrow-btn" onClick={handleNextMonth}>
          &#8594;
        </button>
        <button className="current-month-btn" onClick={goToCurrentMonth}>
          Current Month
        </button>
      </div>

      <div className="calendar-grid">
        {daysInMonth.map(day => {
          const str = dateToString(day);
          const isToday = str === todayString;
          const isSelected = str === selectedDate;
          return (
            <button
              key={str}
              onClick={() => setSelectedDate(str)}
              className={
                "calendar-day-btn" +
                (isToday ? " today" : "") +
                (isSelected ? " selected" : "")
              }
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <h2 className="calls-for-heading">
        Calls for {new Date(selectedDate).toLocaleDateString('en-US')}
        {viewingToday && " (Today)"}
      </h2>

      <div className="flex-row-center">
        {viewingToday &&
          (!onCall ? (
            <button className="start-call-btn" onClick={startCall}>Start Call</button>
          ) : (
            <button className="stop-call-btn" onClick={stopCall}>Stop Call</button>
          ))
        }

        <input
          type="number"
          placeholder="Call ID to delete"
          value={deleteId}
          onChange={e => setDeleteId(e.target.value)}
          className="delete-call-input"
          style={{ marginLeft: viewingToday ? 16 : 0, marginRight: 8 }}
        />
        <button className="start-call-btn" onClick={deleteCall}>Delete Call</button>
        {deleteMsg && (
          <span style={{ marginLeft: 8, color: deleteMsg === 'Call deleted.' ? 'green' : 'red' }}>
            {deleteMsg}
          </span>
        )}
      </div>

      <table className="call-table">
        <tbody>
          {rows.length === 0 ? (
            <tr><td>No calls found for this day.</td></tr>
          ) : (
            rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((c, cIdx) => c ? (
                  <td key={cIdx}>
                    <div>
                      <strong>Call #{c.id}</strong><br />
                      Start: {new Date(c.start).toLocaleTimeString()}<br />
                      End: {c.end ? new Date(c.end).toLocaleTimeString() : "Ongoing"}<br />
                      Duration: {c.end
                        ? (() => {
                            const seconds = (new Date(c.end) - new Date(c.start)) / 1000;
                            const mins = Math.floor(seconds / 60);
                            const secs = Math.floor(seconds % 60);
                            return `${mins > 0 ? mins + "m " : ""}${secs}s`;
                          })()
                        : "—"}
                    </div>
                  </td>
                ) : (
                  <td key={cIdx} />
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
