const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const multer = require('multer');
const path = require('path');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "felnoo",
  password: "1234",
  port: 5432,
});

router.post('/homework-submission', upload.single('submission_file'), async (req, res) => {
    try {
      // Extract submission data from the request body
      const { homework_id, student_id, submission_date, submission_text, score, submission_status, feedback } = req.body;
      const submission_file = req.file ? req.file.path : null;
  
      // Insert submission data into the homework_submission table
      const query = `
        INSERT INTO homework_submission (homework_id, student_id, submission_date, submission_text, score, submission_status, feedback, submission_file)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;
      const values = [homework_id, student_id, submission_date, submission_text, score, submission_status, feedback, submission_file];
  
      const result = await pool.query(query, values);
      const createdSubmission = result.rows[0];
  
      res.json(createdSubmission);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  router.get('/homework-submission/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      const query = 'SELECT * FROM homework_submission WHERE id = $1';
      const result = await pool.query(query, [id]);
      const submission = result.rows[0];
  
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  router.put('/homework-submission/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { homework_id, student_id, submission_date, submission_text, score, submission_status, feedback } = req.body;
  
      const query = `
        UPDATE homework_submission
        SET homework_id = $1, student_id = $2, submission_date = $3, submission_text = $4, score = $5, submission_status = $6, feedback = $7
        WHERE id = $8
        RETURNING *`;
      const values = [homework_id, student_id, submission_date, submission_text, score, submission_status, feedback, id];
  
      const result = await pool.query(query, values);
      const updatedSubmission = result.rows[0];
  
      res.json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  router.delete('/homework-submission/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const query = 'DELETE FROM homework_submission WHERE id = $1';
      await pool.query(query, [id]);
  
      res.json({ message: 'Homework submission deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
module.exports = router;