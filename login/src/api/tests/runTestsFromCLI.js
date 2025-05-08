const { runTests } = require('./testRunner');

async function main() {
  const args = process.argv.slice(2);
  const testPattern = args[0] || null;
  
  console.log(`Running tests${testPattern ? ` with pattern: ${testPattern}` : ''}...`);
  
  try {
    const results = await runTests(testPattern);
    
    console.log('\n================= TEST RESULTS =================');
    console.log(`Tests: ${results.numTotalTests}`);
    console.log(`Passed: ${results.numPassedTests}`);
    console.log(`Failed: ${results.numFailedTests}`);
    console.log(`Success: ${results.success ? 'YES' : 'NO'}`);
    
    if (results.testResults && results.testResults.length > 0) {
      console.log('\n----------- Test Files -----------');
      results.testResults.forEach(file => {
        console.log(`${file.passed ? '✅' : '❌'} ${file.testFilePath} (${file.numPassingTests} passed, ${file.numFailingTests} failed)`);
      });
    }
    
    process.exit(results.success ? 0 : 1);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
