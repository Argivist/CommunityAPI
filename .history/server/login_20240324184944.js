// login.js

// Import required modules
const db = require('./db'); 
const jwt = require('jsonwebtoken');

// Define login handler function
async function handleLogin(req, res) {
  const { username, password } = req.body;

  // Your logic to validate user credentials and query the database
  // Example:
  const user = await db.query('SELECT * FROM user WHERE nickname = ? OR email=?', [username,username]);
    if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }else{
        if (user[0].password === password) {

            }
    }


}

// Export the login handler function
module.exports = { handleLogin };
