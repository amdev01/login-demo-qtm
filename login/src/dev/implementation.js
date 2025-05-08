const path = require('path');

// Stable-specific configuration
module.exports = {
  // Use the fixed path for index.html
  // getIndexPath: () => {
  //     return path.join(__dirname, '..', 'public', 'index.html');
  // },

  // Dev-specific buggy password validation
  validatePassword: (password) => {
      // Buggy validation logic
      const isValidLength = password.length >= 6 && password.length <= 10; // Bug: Should be 5-10
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const isAlphanumeric = /^[a-zA-Z0-9'"]+$/.test(password); // Bug: Allows ' and "
      // Bug: Should check if lowercase letter is present

      if (!isValidLength) {
          return { isValid: false, message: 'Login Failed: Your password is too short.' };
      } else if (!hasUppercase) {
          return { isValid: false, message: 'Login Failed: Your password must include an uppercase character.' };
      } else if (!hasNumber) {
          return { isValid: false, message: 'Login Failed: Your password must include a number.' };
      } else if (!isAlphanumeric) {
          return { isValid: false, message: 'Login Failed: Your password should not contain special characters (except maybe \' or ").' };
      }
      
      return { isValid: true, message: '' };
  },

  // Dev-specific vulnerable query execution
  executeLoginQuery: async (pool, username, password) => {
      // VULNERABILITY: SQL Injection is possible here due to direct string concatenation
      const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
      console.log(`Executing query: ${query}`); // Log the vulnerable query for demo
      return await pool.query(query);
  },

  // Dev-specific success handler with extensive logging
  handleLoginSuccess: (req, res, result) => {
      const username = req.body.username;
      
      // Extensive logging including potential injected data
      console.log('--- Fetched Data (via potential SQL Injection) ---');
      result.rows.forEach(row => {
          const fetchedUser = row.username || (row[1] ? row[1] : 'N/A');
          const fetchedPass = row.password || (row[2] ? row[2] : 'N/A');
          console.log(`Fetched row: User=${fetchedUser}, Pass=${fetchedPass}`);
      });
      console.log('--------------------------------------------------');

      const successMessage = `<h1>Welcome back, ${username}!</h1><p>Login successful!</p>`;
      console.log(`Login successful for input user ${username}. Check console for fetched data if SQLi was used.`);

      res.status(200).send(`
          <html><body>
              ${successMessage}
              <hr>
              <a href="/">Go back</a>
          </body></html>
      `);
  }
};