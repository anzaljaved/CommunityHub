const cors = require('cors');

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Default to Vite dev server
  credentials: true,
};

module.exports = cors(corsOptions);
