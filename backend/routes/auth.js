const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(409).json({ error: 'Email already in use' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
      res.json({ token, user: { email: newUser.email, id: newUser._id } });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;