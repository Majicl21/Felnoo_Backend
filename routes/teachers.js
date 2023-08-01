// routes/teachers.js
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

// CRUD operations for teachers
router.post('/', async (req, res) => {
  try {
    const { username, password, email, contact_number, subject_expertise } = req.body;
    const query = 'INSERT INTO teachers (username, password, email, contact_number, subject_expertise) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [username, password, email, contact_number, subject_expertise];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teachers');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'SELECT * FROM teachers WHERE id = $1';
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, contact_number, subject_expertise } = req.body;
    const query = 'UPDATE teachers SET username = $1, email = $2, contact_number = $3, subject_expertise = $4 WHERE id = $5 RETURNING *';
    const values = [username, email, contact_number, subject_expertise, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'DELETE FROM teachers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
