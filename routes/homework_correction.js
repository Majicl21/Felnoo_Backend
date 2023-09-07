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

// CREATE (POST) route for creating homework corrections
router.post('/homework-correction', async (req, res) => {
    try {
      // Extract correction data from the request body
      const { submission_id, correction_date, correction_text, correction_score, feedback } = req.body;
  
      // Insert correction data into the homework_correction table
      const query = `
        INSERT INTO homework_correction (submission_id, correction_date, correction_text, correction_score, feedback)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
      const values = [submission_id, correction_date, correction_text, correction_score, feedback];
  
      const result = await pool.query(query, values);
      const createdCorrection = result.rows[0];
  
      res.json(createdCorrection);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  router.get('/homework-correction/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Retrieve correction data by ID
      const query = 'SELECT * FROM homework_correction WHERE id = $1';
      const result = await pool.query(query, [id]);
      const correction = result.rows[0];
  
      res.json(correction);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  router.put('/homework-correction/:id', async (req, res) => {
    try {
      const id = req.params.id;
      // Extract updated correction data from the request body
      const { submission_id, correction_date, correction_text, correction_score, feedback } = req.body;
  
      // Update correction data in the database
      const query = `
        UPDATE homework_correction
        SET submission_id = $1, correction_date = $2, correction_text = $3, correction_score = $4, feedback = $5
        WHERE id = $6
        RETURNING *`;
      const values = [submission_id, correction_date, correction_text, correction_score, feedback, id];
  
      const result = await pool.query(query, values);
      const updatedCorrection = result.rows[0];
  
      res.json(updatedCorrection);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  router.delete('/homework-correction/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Delete correction data from the database
      const query = 'DELETE FROM homework_correction WHERE id = $1';
      await pool.query(query, [id]);
  
      res.json({ message: 'Homework correction deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  


module.exports = router;