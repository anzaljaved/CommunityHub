const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection will be added here when implementing business logic

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to CommunityHub API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
