const { runCLI } = require('jest');
const path = require('path');

/**
 * Run Jest tests programmatically
 * @param {string} testPattern - Pattern to match test files (optional)
 * @returns {Promise<object>} - Test results
 */
async function runTests(testPattern = null) {
  const projectRootPath = path.resolve(__dirname, '../../../');
  
  const options = {
    projects: [projectRootPath],
    silent: false,
    json: true
  };
  
  // If a specific test pattern is provided
  if (testPattern) {
    options.testPathPattern = testPattern;
  }
  
  try {
    const { results } = await runCLI(options, [projectRootPath]);
    
    return {
      success: results.success,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numTotalTests: results.numTotalTests,
      testResults: results.testResults.map(result => ({
        testFilePath: path.relative(projectRootPath, result.testFilePath),
        passed: result.numFailingTests === 0,
        numPassingTests: result.numPassingTests,
        numFailingTests: result.numFailingTests
      }))
    };
  } catch (error) {
    console.error('Error running tests:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { runTests };
