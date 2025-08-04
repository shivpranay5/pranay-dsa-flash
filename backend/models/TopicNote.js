const mongoose = require('mongoose');

const topicNoteSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true,
    unique: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TopicNote', topicNoteSchema); 