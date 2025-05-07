const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // Import the fs module

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Determine index.html path based on file existence
let indexPath = path.join(__dirname, 'index.html'); // Default to current directory
if (!fs.existsSync(indexPath)) {
    // If not found in current directory, try one directory up
    indexPath = path.join(__dirname, '..', 'index.html');
}

// Serve the static index.html file
app.get('/', (req, res) => {
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending file:", indexPath, err);
            if (!res.headersSent) {
                res.status(404).send("Error: index.html not found at determined path.");
            }
        }
    });
});

// Use environment variables for database connection
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT,
});

// Test connection (optional, pool connects lazily)
pool.query('SELECT NOW()', (err, resQuery) => { // Renamed res to resQuery to avoid conflict
  if (err) {
    console.error('Error connecting to database:', err);
  } else if (resQuery && resQuery.rows && resQuery.rows.length > 0) {
    console.log('Connected to database at:', resQuery.rows[0].now);
  } else {
     console.log('Connected to database, but no time returned.');
  }
});


app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let validationMessage = '';
    
    // --- Start: Buggy Validation Logic (remains the same) ---
    const isValidLength = password.length >= 6 && password.length <= 10; // Bug: Should be 5-10
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isAlphanumeric = /^[a-zA-Z0-9'"]+$/.test(password); // Bug: Allows ' and "
    // Bug: Should check if lowercase letter is present

    if (!isValidLength) {
      validationMessage = 'Login Failed: Your password is too short.';
    } else if (!hasUppercase) {
      validationMessage = 'Login Failed: Your password must include an uppercase character.';
    } else if (!hasNumber) {
      validationMessage = 'Login Failed: Your password must include a number.';
    } else if (!isAlphanumeric) {
      validationMessage = 'Login Failed: Your password should not contain special characters (except maybe \' or ").';
    }
    // --- End: Buggy Validation Logic ---

    // If validation failed, redirect back to login page with error message
    if (validationMessage) {
        console.log(`Validation failed for user ${username}: ${validationMessage}`);
        // Redirect back to '/' with the error message in query params
        return res.redirect('/?error=' + encodeURIComponent(validationMessage));
    }

    // --- If validation passes, proceed with vulnerable query ---
    console.log(`Validation passed for user ${username}. Proceeding with login query.`);
    // VULNERABILITY: SQL Injection is possible here due to direct string concatenation.
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    try {
        console.log(`Executing query: ${query}`); // Log the query for demo
        const result = await pool.query(query);
        console.log(`Query returned ${result.rows ? result.rows.length : 0} rows.`); // Log row count

        if (result.rows && result.rows.length > 0) {
            // MODIFIED: Log fetched data to console instead of displaying in HTML
            console.log('--- Fetched Data (via potential SQL Injection) ---');
            result.rows.forEach(row => {
                // Assuming columns are id, username, password in order (adjust if needed)
                const fetchedUser = row.username || (row[1] ? row[1] : 'N/A'); // Try accessing by name or index 1
                const fetchedPass = row.password || (row[2] ? row[2] : 'N/A'); // Try accessing by name or index 2
                // Log the fetched data to the server console
                console.log(`Fetched row: User=${fetchedUser}, Pass=${fetchedPass}`);
            });
            console.log('--------------------------------------------------');

            // Reverted success message: Still vulnerable to XSS via the *inputted* username
            const successMessage = `<h1>Welcome back, ${username}!</h1><p>Login successful!</p>`; // Potential XSS via input username
            console.log(`Login successful for input user ${username}. Check console for fetched data if SQLi was used.`);

            res.status(200).send(`
                <html><body>
                    ${successMessage}
                    <hr>
                    <a href="/">Go back</a>
                </body></html>
            `);

        } else {
            const failureMessage = 'Invalid username or password!';
            console.log(`Invalid credentials for user ${username}`);
            // Redirect back to '/' with the error message
            return res.redirect('/?error=' + encodeURIComponent(failureMessage));
        }
    } catch (err) {
        console.error('Database query error:', err);
        const errorMessage = 'Internal server error during login.';
        // Redirect back to '/' with the error message
        return res.redirect('/?error=' + encodeURIComponent(errorMessage));
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
