const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000; // Express API រត់លើ Port 5000

// បើក CORS ឱ្យ Frontend ពី Port 3001 អាចហៅមក Backend បាន
app.use(cors());
app.use(express.json());

// ភ្ជាប់ទៅកាន់ PostgreSQL Database លើ Port 5433 (Docker)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'mydb',
});

// Auto Create Table & Seed Default User
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // បញ្ចូល Account Default
    await pool.query(`
      INSERT INTO users (name, email, password) 
      VALUES ('Sreyleak', 'sreyleak@gmail.com', '123456') 
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('✅ Connected to PostgreSQL & Database initialized!');
  } catch (err) {
    console.error('❌ Database Initialization Error:', err.message);
  }
};

// API Endpoint សម្រាប់ Checking status
app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "🚀 Backend Connected to PostgreSQL Successfully!",
    environment: "development"
  });
});

// 🆕 API Endpoint សម្រាប់មើលទិន្នន័យ Users ទាំងអស់ក្នុង Database
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
    res.json({
      success: true,
      total: result.rows.length,
      users: result.rows
    });
  } catch (err) {
    console.error('Fetch Users Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Internal Error' });
  }
});

// API Endpoint សម្រាប់ Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'សូមបញ្ចូល Email និង Password!' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        message: 'ចូលប្រព័ន្ធជោគជ័យ! សូមស្វាគមន៍',
        user: result.rows[0]
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Email ឬ Password មិនត្រឹមត្រូវទេ!'
      });
    }
  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server Internal Error' });
  }
});

// API Endpoint សម្រាប់ Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'សូមបញ្ចូល Email និង Password!' });
  }

  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email នេះមានរួចហើយ!' });
    }

    const userName = email.split('@')[0];
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [userName, email, password]
    );

    return res.status(201).json({
      success: true,
      message: 'បង្កើត Account ថ្មីជោគជ័យ! អ្នកអាច Login បានឥឡូវនេះ។',
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server Internal Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  initDB();
});