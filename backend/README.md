# DSA Flash Backend

Backend API for the DSA Flash application with MongoDB database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/dsa-flash
PORT=5000
```

3. Start MongoDB locally or use MongoDB Atlas

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Topics
- GET `/api/topics` - Get all topics
- POST `/api/topics` - Create a topic
- PUT `/api/topics/:id` - Update a topic
- DELETE `/api/topics/:id` - Delete a topic

### Problems
- GET `/api/problems` - Get all problems
- GET `/api/problems/topic/:topicId` - Get problems by topic
- POST `/api/problems` - Create a problem
- PUT `/api/problems/:id` - Update a problem
- DELETE `/api/problems/:id` - Delete a problem

### Notes
- GET `/api/notes/:topicId` - Get notes for a topic
- POST `/api/notes` - Save notes for a topic

### File Upload
- POST `/api/upload` - Upload an image 