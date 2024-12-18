const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

const app = express();

// JWT Secret Key
const jwtSecret = process.env.JWT_SECRET || "babakofficial";

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'https://campus-project-front-end.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept',
      'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['*', 'Authorization']
  })
);

// Ensure uploads directory exists and configure static serving
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory at:', uploadDir);
} else {
  console.log('Uploads directory exists at:', uploadDir);
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
    } else {
      console.log('Files in uploads directory:', files);
    }
  });
}

// Configure static file serving with CORS headers
app.use("/uploads", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://campus-project-front-end.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir));

// Image debug routes
app.get('/debug-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadDir, filename);
  
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      res.json({
        exists: false,
        requestedPath: filepath,
        error: err.message
      });
    } else {
      res.json({
        exists: true,
        path: filepath,
        stats: fs.statSync(filepath)
      });
    }
  });
});

// ... rest of your routes ...

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
