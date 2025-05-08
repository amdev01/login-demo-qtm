const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const testsController = require('../api/tests/testsController');

/**
 * Creates and configures the Express application
 * @param {Object} config - Server configuration options
 * @returns {Object} Express application instance
 */
function createServer(config) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    
    // Initialize with default implementations that can be overridden
    const serverConfig = {
        // Default index path resolver - can be overridden
        getIndexPath: () => path.join(__dirname, '..', 'public', 'index.html'),
        
        // Default validation function - should be overridden
        validatePassword: () => ({ isValid: true, message: '' }),
        
        // Default query executor - should be overridden
        executeLoginQuery: async () => ({ rows: [] }),
        
        // Default success handler - can be overridden
        handleLoginSuccess: (req, res, result) => {
            const username = req.body.username;
            res.status(200).send(`
                <html><body>
                    <h1>Welcome back, ${username}!</h1><p>Login successful!</p>
                    <hr>
                    <a href="/">Go back</a>
                </body></html>
            `);
        },
        
        // Apply overrides from config
        ...config
    };

    // Serve the index.html file
    app.get('/', (req, res) => {
        const indexPath = serverConfig.getIndexPath();
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error("Error sending file:", indexPath, err);
                if (!res.headersSent) {
                    res.status(404).send("Error: index.html not found at determined path.");
                }
            }
        });
    });

    // Initialize database connection pool
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.DB_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.DB_PORT,
    });

    // Test connection
    pool.query('SELECT NOW()', (err, resQuery) => {
        if (err) {
            console.error('Error connecting to database:', err);
        } else if (resQuery && resQuery.rows && resQuery.rows.length > 0) {
            console.log('Connected to database at:', resQuery.rows[0].now);
        } else {
            console.log('Connected to database, but no time returned.');
        }
    });

    // Login route
    app.post('/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        
        // Validate password using the configured validator
        const validationResult = serverConfig.validatePassword(password);
        
        if (!validationResult.isValid) {
            console.log(`Validation failed for user ${username}: ${validationResult.message}`);
            return res.redirect('/?error=' + encodeURIComponent(validationResult.message));
        }

        console.log(`Validation passed for user ${username}. Proceeding with login query.`);
        
        try {
            // Execute login query using the configured executor
            const result = await serverConfig.executeLoginQuery(pool, username, password);
            console.log(`Query returned ${result.rows ? result.rows.length : 0} rows.`);

            if (result.rows && result.rows.length > 0) {
                // Handle successful login using the configured handler
                serverConfig.handleLoginSuccess(req, res, result);
            } else {
                const failureMessage = 'Invalid username or password!';
                console.log(`Invalid credentials for user ${username}`);
                return res.redirect('/?error=' + encodeURIComponent(failureMessage));
            }
        } catch (err) {
            console.error('Database query error:', err);
            const errorMessage = 'Internal server error during login.';
            return res.redirect('/?error=' + encodeURIComponent(errorMessage));
        }
    });

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../../public')));

    // API Routes
    //app.use('/api/auth', authRoutes);
    app.use('/api/tests', testsController);

    return { app, pool };
}

/**
 * Starts the server on the specified port
 * @param {Object} app - Express application instance
 * @param {number} port - Port to listen on
 * @returns {Object} Server instance
 */
function startServer(app, port = process.env.PORT || 3000) {
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = {
  createServer,
  startServer
};
