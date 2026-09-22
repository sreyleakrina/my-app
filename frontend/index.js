const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login System</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; }
    .card { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(16px); padding: 2.5rem; border-radius: 20px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.2); width: 100%; max-width: 400px; text-align: center; }
    .card h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .subtitle { font-size: 0.85rem; opacity: 0.8; margin-bottom: 1.5rem; }
    .input-group { margin-bottom: 1.2rem; text-align: left; }
    .input-group label { display: block; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .input-group input { width: 100%; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.2); color: #fff; font-size: 0.95rem; outline: none; }
    .btn-group { display: flex; gap: 10px; margin-top: 1rem; }
    .btn { flex: 1; padding: 0.8rem; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.2s; }
    .btn-login { background: #26de81; color: #1e272e; }
    .btn-register { background: rgba(255, 255, 255, 0.3); color: #fff; }
    #alert-msg { margin-top: 1.2rem; padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; display: none; }
    .success { background: rgba(38, 222, 129, 0.3); border: 1px solid #26de81; color: #fff; }
    .error { background: rgba(255, 77, 77, 0.3); border: 1px solid #ff4d4d; color: #fff; }
  </style>
</head>
<body>

  <div class="card">
    <h2>🔑 ចូលប្រព័ន្ធ</h2>
    <p class="subtitle">បញ្ចូល Email និង Password ដើម្បី Login ឬ Register Account ថ្មី</p>

    <div class="input-group">
      <label for="email">អ៊ីមែល (Email)</label>
      <input type="email" id="email" value="sreyleak@gmail.com" placeholder="user@example.com">
    </div>

    <div class="input-group">
      <label for="password">ពាក្យសម្ងាត់ (Password)</label>
      <input type="password" id="password" value="123456" placeholder="••••••••">
    </div>

    <div class="btn-group">
      <button type="button" id="btnLogin" class="btn btn-login">Login</button>
      <button type="button" id="btnRegister" class="btn btn-register">Register ថ្មី</button>
    </div>

    <div id="alert-msg"></div>
  </div>

  <script>
    const alertMsg = document.getElementById('alert-msg');
    
    // ចាក់តម្លៃ URL ដោយផ្ទាល់
    const API_URL = "` + BACKEND_URL + `";

    function showAlert(msg, isSuccess) {
      alertMsg.style.display = 'block';
      alertMsg.className = isSuccess ? 'success' : 'error';
      alertMsg.innerText = msg;
    }

    // Login
    document.getElementById('btnLogin').addEventListener('click', async () => {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const response = await fetch(API_URL + '/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        showAlert(result.message, response.ok && result.success);
      } catch (error) {
        showAlert('មិនអាចភ្ជាប់ទៅកាន់ Backend Server បានទេ!', false);
      }
    });

    // Register
    document.getElementById('btnRegister').addEventListener('click', async () => {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const response = await fetch(API_URL + '/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        showAlert(result.message, response.ok && result.success);
      } catch (error) {
        showAlert('មិនអាចភ្ជាប់ទៅកាន់ Backend Server បានទេ!', false);
      }
    });
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend Web UI running on port ${PORT}`);
});