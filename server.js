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
// const dateFns = require('date-fns');  // Comment this out temporarily if not needed yet

const app = express();

// JWT Secret Key
const jwtSecret = "your_jwt_secret";

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for remote databases
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      
      const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Helper Functions
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const query = `SELECT * FROM "Users" WHERE role = $1 LIMIT 1`;
    const result = await pool.query(query, ["admin"]);

    if (result.rowCount === 0) {
      const insertQuery = `
        INSERT INTO "Users" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW());
      `;
      const values = [
        "Admin",
        "admin@example.com",
        bcrypt.hashSync("admin123", 10),
        "admin",
      ];
      await pool.query(insertQuery, values);
      console.log("Default admin created");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

// Add these functions after your helper functions and before the database initialization

// Create Users table
const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating Users table:', error);
    throw error;
  }
};

// Create Events table
const createEventsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Events" (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        organizer VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        image VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Events table created or already exists');
  } catch (error) {
    console.error('Error creating Events table:', error);
    throw error;
  }
};

// Create RSVPs table (you already have this)
const createRSVPsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "RSVPs" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES "Users"(id),
        event_id INTEGER REFERENCES "Events"(id),
        status VARCHAR(20) CHECK (status IN ('ATTENDING', 'UNAVAILABLE')),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, event_id)
      );
    `);
    console.log('RSVPs table created or already exists');
  } catch (error) {
    console.error('Error creating RSVPs table:', error);
    throw error;
  }
};

// Add this function to your server.js
const updateExistingEvents = async () => {
  try {
    // Update all existing events without a category to have a default category
    await pool.query(`
      UPDATE "Events"
      SET category = 'club_activities'
      WHERE category IS NULL;
    `);
    console.log('Updated existing events with default category');
  } catch (error) {
    console.error('Error updating existing events:', error);
  }
};

// Initialize database function (you already have this)
const initializeDatabase = async () => {
  try {
    await createUsersTable();
    await createEventsTable();
    await createRSVPsTable();
    await createDefaultAdmin();
    await updateExistingEvents();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Test database connection
pool.connect()
  .then(() => {
    console.log("Database connected");
    initializeDatabase();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// Routes
app.get("/test", (req, res) => res.json("test ok"));

app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO "Users" (name, email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, role;
    `;
    const values = [name, email, hashedPassword, role || "user"];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Registration successful", user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      // Duplicate email error
      res.status(400).json({
        error: "Duplicate entry",
        details: "This email is already registered. Please log in instead.",
      });
    } else {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed", details: error.message });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `SELECT id, name, email, password, role FROM "Users" WHERE email = $1;`;
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    // Send user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/createEvent", authenticateToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, date, time, location, description, organizer, category } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    // Log the received data for debugging
    console.log('Received event data:', { title, date, time, location, description, organizer, category });

    const query = `
      INSERT INTO "Events" (
        title, date, time, location, description,
        organizer, category, image, "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *;
    `;

    const values = [title, date, time, location, description, organizer, category, imagePath];
    const result = await pool.query(query, values);

    if (!result.rows[0]) {
      throw new Error('Failed to create event');
    }

    res.status(201).json({
      message: "Event created successfully",
      event: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      error: "Failed to create event",
      details: error.message
    });
  }
});

app.get("/events", async (req, res) => {
  try {
    const query = `SELECT * FROM "Events" ORDER BY "createdAt" DESC;`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    res.status(500).json({ error: "Failed to fetch events", details: error.message });
  }
});

app.get("/event/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        id,
        title,
        description,
        date,
        time,
        location,
        organizer,
        image,
        "createdAt",
        "updatedAt"
      FROM "Events" 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Format the event data
    const event = {
      ...result.rows[0],
      imageUrl: result.rows[0].image ? `/uploads/${result.rows[0].image}` : null
    };

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event", details: error.message });
  }
});

app.get("/calendar-events", async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        title,
        description,
        date,
        time,
        location,
        organizer,
        image
      FROM "Events"
      ORDER BY date ASC, time ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Add endpoint to serve images
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

// Get RSVPs for an event
app.get("/event/:id/rsvps", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT r.*, u.name as user_name 
      FROM "RSVPs" r
      JOIN "Users" u ON r.user_id = u.id
      WHERE r.event_id = $1
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

// Create or update RSVP
app.post("/event/:id/rsvp", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // First, check if the event exists
    const eventCheck = await pool.query('SELECT id FROM "Events" WHERE id = $1', [id]);
    if (eventCheck.rowCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if RSVP already exists
    const checkQuery = `SELECT * FROM "RSVPs" WHERE user_id = $1 AND event_id = $2`;
    const existing = await pool.query(checkQuery, [userId, id]);

    let result;
    if (existing.rowCount > 0) {
      // Update existing RSVP
      const updateQuery = `
        UPDATE "RSVPs" 
        SET status = $1, "updatedAt" = NOW()
        WHERE user_id = $2 AND event_id = $3
        RETURNING *
      `;
      result = await pool.query(updateQuery, [status, userId, id]);
    } else {
      
      // Create new RSVP
      const insertQuery = `
        INSERT INTO "RSVPs" (user_id, event_id, status, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `;
      result = await pool.query(insertQuery, [userId, id, status]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating RSVP:", error);
    res.status(500).json({ error: "Failed to update RSVP" });
  }
});

// Get user's RSVP for an event
app.get("/event/:id/my-rsvp", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const query = `SELECT * FROM "RSVPs" WHERE user_id = $1 AND event_id = $2`;
    const result = await pool.query(query, [userId, id]);

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("Error fetching RSVP:", error);
    res.status(500).json({ error: "Failed to fetch RSVP" });
  }
});

// Add this with your other routes
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const query = `SELECT id, name, email, role FROM "Users" WHERE id = $1`;
        const result = await pool.query(query, [req.user.id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// Make sure this endpoint is properly placed with your other routes
app.delete("/event/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the event exists
    const eventExists = await pool.query('SELECT * FROM "Events" WHERE id = $1', [id]);
    if (eventExists.rowCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Then delete RSVPs
    await pool.query('DELETE FROM "RSVPs" WHERE event_id = $1', [id]);

    // Get event details for image
    const eventQuery = 'SELECT image FROM "Events" WHERE id = $1';
    const eventResult = await pool.query(eventQuery, [id]);
    const event = eventResult.rows[0];

    // Delete the event
    const deleteQuery = 'DELETE FROM "Events" WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    // Delete image file if it exists
    if (event && event.image) {
      const imagePath = path.join(__dirname, 'uploads', event.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
