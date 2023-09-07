// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "felnoo",
  password: "1234",
  port: 5432,
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const query = "SELECT * FROM students WHERE username = $1";
    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
        query = "SELECT * FROM teachers WHERE username = $1";
        result = await pool.query(query, [username]);
        user = result.rows[0];
      }

    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token and send it as the response
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
