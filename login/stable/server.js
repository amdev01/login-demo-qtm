const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

    // --- Start: Corrected Validation Logic ---
    const isLengthOk = password.length >= 5 && password.length <= 10; // Corrected length: 5-10
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password); // Added lowercase check
    const hasNumber = /\d/.test(password);
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(password); // Corrected: No special chars allowed

    // Updated validation checks and messages
    if (password.length < 5) {
        validationMessage = 'Login Failed: Password must be at least 5 characters long.';
    } else if (password.length > 10) {
        validationMessage = 'Login Failed: Password must be no more than 10 characters long.';
    } else if (!hasUppercase) {
        validationMessage = 'Login Failed: Password must include at least one uppercase letter.';
    } else if (!hasLowercase) {
        validationMessage = 'Login Failed: Password must include at least one lowercase letter.';
    } else if (!hasNumber) {
        validationMessage = 'Login Failed: Password must include at least one number.';
    } else if (!isAlphanumeric) {
        // This case might be redundant if length/char type checks pass, but good for clarity
        validationMessage = 'Login Failed: Password must contain only alphanumeric characters (a-z, A-Z, 0-9).';
    }
    // --- End: Corrected Validation Logic ---

    // If validation failed, redirect back to login page with error message
    if (validationMessage) {
        console.log(`Validation failed for user ${username}: ${validationMessage}`);
        // Redirect back to '/' with the error message in query params
        return res.redirect('/?error=' + encodeURIComponent(validationMessage));
    }

    // --- If validation passes, proceed with login check ---
    // MODIFIED: Use parameterized query to prevent SQL Injection
    // This allows login with usernames containing special chars (like scripts) if they exist in DB
    const queryText = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const queryValues = [username, password];
    console.log(`Validation passed for user ${username}. Proceeding with parameterized login query.`);

    try {
        console.log(`Executing query: ${queryText} with values: [${queryValues.join(', ')}]`); // Log query and values
        // Use parameterized query
        const result = await pool.query(queryText, queryValues);
        console.log(`Query returned ${result.rows ? result.rows.length : 0} rows.`); // Log row count

        if (result.rows && result.rows.length > 0) {
            // Log fetched data to console (original user info, not injected data)
            console.log('--- User Data ---');
            result.rows.forEach(row => {
                console.log(`User found: ID=${row.id}, User=${row.username}`); // Don't log password here
            });
            console.log('-----------------');

            // Success message: Still vulnerable to XSS via the *inputted* (and now successfully authenticated) username
            const successMessage = `<h1>Welcome back, ${username}!</h1><p>Login successful!</p>`; // Potential XSS via input username
            console.log(`Login successful for user ${username}.`);

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