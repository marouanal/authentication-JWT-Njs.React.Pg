require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testapi',
  password: 'ytreza',
  port: 5433,
});

// Endpoint for user registration
app.post('/register', async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  // Hash the password before saving it to the database
  console.log('Password:', password);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    const user = { id: result.rows[0].id };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: `Bearer ${accessToken}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('Authentication app is up and running!');
});

// Endpoint for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password with the input password
    const user = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: `Bearer ${accessToken}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Protected endpoint
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token not found');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    req.user = user;
    next();
  });
}

app.listen(3001, () => {
  console.log('Server started on port 3000');
});
