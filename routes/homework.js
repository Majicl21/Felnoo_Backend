const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const multer = require('multer');
const path = require('path');

// PostgreSQL configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "felnoo",
  password: "1234",
  port: 5432,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// CREATE (POST) route for creating homework
router.post('/homework', upload.single('file_attachment'), async (req, res) => {
  try {
    // Extract homework data from the request body
    const { course_id, teacher_id, deadline, description } = req.body;
    const file_attachment = req.file ? req.file.path : null;

    // Insert homework data into the homework table
    const query = `
      INSERT INTO homework (course_id, teacher_id, deadline, description, file_attachment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [course_id, teacher_id, deadline, description, file_attachment];

    const result = await pool.query(query, values);
    const createdHomework = result.rows[0];

    res.json(createdHomework);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/homework/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Retrieve homework data by ID
    const query = 'SELECT * FROM homework WHERE id = $1';
    const result = await pool.query(query, [id]);
    const homework = result.rows[0];

    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/homework/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Extract updated homework data from the request body
    const { course_id, teacher_id, deadline, description } = req.body;

    // Update homework data in the database
    const query = `
      UPDATE homework
      SET course_id = $1, teacher_id = $2, deadline = $3, description = $4
      WHERE id = $5
      RETURNING *`;
    const values = [course_id, teacher_id, deadline, description, id];

    const result = await pool.query(query, values);
    const updatedHomework = result.rows[0];

    res.json(updatedHomework);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/homework/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Delete homework data from the database
    const query = 'DELETE FROM homework WHERE id = $1';
    await pool.query(query, [id]);

    res.json({ message: 'Homework deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
