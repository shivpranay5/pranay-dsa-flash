const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  leetcodeUrl: {
    type: String,
    trim: true
  },
  geeksforgeeksUrl: {
    type: String,
    trim: true
  },
  solution: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  timeComplexity: {
    type: String,
    trim: true
  },
  spaceComplexity: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema); 