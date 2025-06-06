const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: Date,
  end: Date,
  date: String
});

module.exports = mongoose.model('Call', callSchema);
