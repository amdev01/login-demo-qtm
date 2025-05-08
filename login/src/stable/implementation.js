const path = require('path');

// Stable-specific configuration
module.exports = {
  // Stable-specific index path resolver (direct path)
  // getIndexPath: () => path.join(__dirname, 'index.html'),

  // Stable-specific corrected password validation
  validatePassword: (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(password);

    if (password.length <= 5) {
      return { isValid: false, message: 'Login Failed: Password must be at least 5 characters long.' };
    } else if (password.length >= 10) {
      return { isValid: false, message: 'Login Failed: Password must be no more than 10 characters long.' };
    } else if (!hasUppercase) {
      return { isValid: false, message: 'Login Failed: Password must include at least one uppercase letter.' };
    } else if (!hasLowercase) {
      return { isValid: false, message: 'Login Failed: Password must include at least one lowercase letter.' };
    } else if (!hasNumber) {
      return { isValid: false, message: 'Login Failed: Password must include at least one number.' };
    } else if (!isAlphanumeric) {
      return { isValid: false, message: 'Login Failed: Password must contain only alphanumeric characters (a-z, A-Z, 0-9).' };
    }
    
    return { isValid: true, message: '' };
  },

  // Stable-specific secure parameterized query
  executeLoginQuery: async (pool, username, password) => {
    const queryText = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const queryValues = [username, password];
    console.log(`Executing query: ${queryText} with values: [${queryValues.join(', ')}]`);
    return await pool.query(queryText, queryValues);
  },

  // Stable-specific success handler with secure logging
  handleLoginSuccess: (req, res, result) => {
    const username = req.body.username;
    
    // More secure logging (no passwords)
    console.log('--- User Data ---');
    result.rows.forEach(row => {
      console.log(`User found: ID=${row.id}, User=${row.username}`);
    });
    console.log('-----------------');

    const successMessage = `<h1>Welcome back, ${username}!</h1><p>Login successful!</p>`;
    console.log(`Login successful for user ${username}.`);

    res.status(200).send(`
      <html><body>
        ${successMessage}
        <hr>
        <a href="/">Go back</a>
      </body></html>
    `);
  }
};
