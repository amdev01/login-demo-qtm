const express = require('express');
const { runTests } = require('./testRunner');

const router = express.Router();

/**
 * Run all tests or specific test suite
 * GET /api/tests?suite=backend/validation
 */
router.get('/', async (req, res) => {
  try {
    const { suite } = req.query;
    const testResults = await runTests(suite);
    res.json(testResults);
  } catch (error) {
    console.error('Error handling test request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to run tests',
      message: error.message 
    });
  }
});

/**
 * Run specific test categories
 * GET /api/tests/backend
 */
router.get('/backend', async (req, res) => {
  try {
    const testResults = await runTests('/__tests__/backend/');
    res.json(testResults);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to run backend tests',
      message: error.message 
    });
  }
});

/**
 * Run specific test categories
 * GET /api/tests/frontend
 */
router.get('/frontend', async (req, res) => {
  try {
    const testResults = await runTests('/__tests__/frontend/');
    res.json(testResults);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to run frontend tests',
      message: error.message 
    });
  }
});

module.exports = router;
