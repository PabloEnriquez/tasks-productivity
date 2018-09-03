const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: {
    min: { type: Number, required: true },
    sec: { type: Number, required: true }
  }, required: true },
  completion: {
    min: { type: Number, required: true, default: 0 },
    sec: { type: Number, required: true, default: 0 }
  },
  isCompleted: { type: Boolean, required: true, default: false },
  date: { type: Date, required: false, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
