const mongoose = require('mongoose');

const topicNoteSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TopicNote', topicNoteSchema); 