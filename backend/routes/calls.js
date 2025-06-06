const express = require('express');
const jwt = require('jsonwebtoken');
const Call = require('../models/Call');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const calls = await Call.find({ userId: req.user.userId });
  res.json(calls);
});

router.post('/start', async (req, res) => {
  const now = new Date();
  const call = await Call.create({
    userId: req.user.userId,
    start: now,
    date: now.toISOString().slice(0, 10)
  });
  res.json(call);
});

router.post('/stop', async (req, res) => {
  const ongoing = await Call.findOne({ userId: req.user.userId, end: null }).sort({ start: -1 });
  if (!ongoing) return res.status(400).json({ error: 'No active call' });
  ongoing.end = new Date();
  await ongoing.save();
  res.json(ongoing);
});

router.delete('/delete', async (req, res) => {
  const { callId } = req.body;
  const call = await Call.findOne({ _id: callId, userId: req.user.userId });
  if (!call) return res.status(404).json({ error: 'Call not found' });
  await call.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;