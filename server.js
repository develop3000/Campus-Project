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

// Configure uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory at:', uploadDir);
}

// Configure static file serving
app.use("/uploads", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://campus-project-front-end.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Helper Functions
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Routes
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO "Users" (name, email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, role;
    `;
    const result = await pool.query(query, [name, email, hashedPassword, 'user']);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = `SELECT * FROM "Users" WHERE email = $1;`;
    const result = await pool.query(query, [email]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.rows[0];
    const passOk = await bcrypt.compare(password, user.password);
    if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/createEvent", authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, time, location, organizer, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO "Events" (title, description, date, time, location, organizer, category, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const values = [title, description, date, time, location, organizer, category, image];
    const result = await pool.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const query = `SELECT * FROM "Events" ORDER BY date ASC;`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get('/auth-status', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ 
      authenticated: true, 
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ message: "Logged out successfully" });
});

// Debug route for images
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Upload directory:', uploadDir);
});
