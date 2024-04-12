// login.js

// Import required modules
const db = require('./db'); 
const jwt = require('jsonwebtoken');

// Define login handler function
async function handleLogin(req, res) {
  const { username, password } = req.body;

  // Your logic to validate user credentials and query the database
  // Example:
  const user = await db.getUserByUsername(username);

  if (!user || user.password !== password) {
    // Invalid credentials
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ username: user.username }, 'secret');

  // Send the token in the response
  res.json({ token });
}

// Export the login handler function
module.exports = { handleLogin };
