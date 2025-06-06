const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

require('dotenv').config();

const mongoose = require('mongoose');


const authRoutes = require('./routes/auth');
const callRoutes = require('./routes/calls');


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/calls', callRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(4000, () => console.log('Server running on port 4000'));
  })
  .catch(err => console.error(err));


// In-memory storage
let calls = []; // { id, start, end, date }

app.post('/api/start', (req, res) => {
    const { workerId } = req.body;
    const now = new Date();
    // Only allow one ongoing call per worker
    const ongoing = calls.find(c => c.workerId === workerId && !c.end);
    if (ongoing) return res.status(400).json({ error: 'Call already in progress' });

    const call = {
        id: calls.length + 1,
        workerId,
        start: now,
        end: null,
        date: now.toISOString().slice(0, 10), // YYYY-MM-DD
    };
    calls.push(call);
    res.json(call);
});

app.post('/api/stop', (req, res) => {
    const { workerId } = req.body;
    const now = new Date();
    const call = calls.find(c => c.workerId === workerId && !c.end);
    if (!call) return res.status(400).json({ error: 'No ongoing call' });
    call.end = now;
    res.json(call);
});

app.get('/api/calls', (req, res) => {
    const { workerId } = req.query;
    const userCalls = calls.filter(c => c.workerId === workerId);
    res.json(userCalls);
});

app.get('/api/statistics', (req, res) => {
    const { workerId } = req.query;
    const userCalls = calls.filter(c => c.workerId === workerId && c.end);

    // Group by date
    const stats = {};
    userCalls.forEach(c => {
        const date = c.date;
        if (!stats[date]) stats[date] = [];
        stats[date].push((new Date(c.end) - new Date(c.start)) / 1000); // seconds
    });

    // Build output: calls per day, avg call time per day
    const result = Object.entries(stats).map(([date, durations]) => ({
        date,
        callCount: durations.length,
        avgCallTime: durations.reduce((a, b) => a + b, 0) / durations.length
    }));

    res.json(result);
});

// Add this new endpoint to your server.js
app.delete('/api/delete', (req, res) => {
    const { callId } = req.body;
    const idx = calls.findIndex(c => c.id == callId);
    if (idx === -1) return res.status(404).json({ error: 'Call not found' });
    calls.splice(idx, 1);
    res.json({ success: true });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
