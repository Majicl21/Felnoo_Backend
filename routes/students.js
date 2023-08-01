// routes/students.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// PostgreSQL configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'felnoo',
  password: '1234',
  port: 5432,
});

// CREATE (POST) route for students
router.post('/', async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      first_name,
      last_name,
      birthday,
      contact_number,
      address,
      parent_id,
    } = req.body;

    const query =
      'INSERT INTO students (username, password, email, first_name, last_name, birthday, contact_number, address, parent_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
    const values = [
      username,
      password,
      email,
      first_name,
      last_name,
      birthday,
      contact_number,
      address,
      parent_id,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// READ (GET) route for all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// READ (GET) route for a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'SELECT * FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// UPDATE (PUT) route for a specific student by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {
      username,
      password,
      email,
      first_name,
      last_name,
      birthday,
      contact_number,
      address,
      parent_id,
    } = req.body;

    const query =
      'UPDATE students SET username = $1, password = $2, email = $3, first_name = $4, last_name = $5, birthday = $6, contact_number = $7, address = $8, parent_id = $9 WHERE id = $10 RETURNING *';
    const values = [
      username,
      password,
      email,
      first_name,
      last_name,
      birthday,
      contact_number,
      address,
      parent_id,
      id,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE route for a specific student by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'DELETE FROM students WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});



module.exports = router;
