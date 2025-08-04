const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-flash', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Models
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');
const TopicNote = require('./models/TopicNote');

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Topics
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await Topic.find().sort('order');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/topics', async (req, res) => {
  try {
    const topic = new Topic(req.body);
    const savedTopic = await topic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/topics/:id', async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    await Problem.deleteMany({ topicId: req.params.id });
    await TopicNote.findOneAndDelete({ topicId: req.params.id });
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Problems
app.get('/api/problems', async (req, res) => {
  try {
    const problems = await Problem.find().sort('-createdAt');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/problems/topic/:topicId', async (req, res) => {
  try {
    const problems = await Problem.find({ topicId: req.params.topicId }).sort('-createdAt');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/problems', async (req, res) => {
  try {
    const problem = new Problem(req.body);
    const savedProblem = await problem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/problems/:id', async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Topic Notes
app.get('/api/topic-notes/:topicId', async (req, res) => {
  try {
    const note = await TopicNote.findOne({ topicId: req.params.topicId });
    res.json({ notes: note ? note.notes : '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/topic-notes/:topicId', async (req, res) => {
  try {
    const { notes } = req.body;
    const note = await TopicNote.findOneAndUpdate(
      { topicId: req.params.topicId },
      { topicId: req.params.topicId, notes },
      { upsert: true, new: true }
    );
    res.json({ notes: note.notes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// File upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 