require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community');
const issueRoutes = require('./routes/issueRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const threadRoutes = require("./routes/threadRoutes");
const messageRoutes = require("./routes/messageRoutes");


const auth = require('./middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/announcements', announcementRoutes);


// Protected route example
app.get('/api/protected', auth, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user,
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to CommunityHub API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/threads", threadRoutes);
app.use("/api/threads", messageRoutes);
