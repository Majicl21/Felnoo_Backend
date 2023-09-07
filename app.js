// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'felnoo',
  password: '1234',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

const teachersRoutes = require('./routes/teachers');
app.use('/api/teachers', teachersRoutes);

const studentsRoutes = require('./routes/students');
app.use('/api/students', studentsRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});