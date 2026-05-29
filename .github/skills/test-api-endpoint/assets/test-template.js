/**
 * Template for creating custom API endpoint tests
 * 
 * Copy this file and modify for specific endpoint testing needs
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:5173',
  timeout: 5000,
  verbose: true
};

// Define your test cases
const TEST_CASES = [
  {
    name: 'Get 2024 Primary Results',
    endpoint: '/api/results/2024',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      // Add custom validation logic
      return response.election_date && 
             response.county === 'Lancaster' &&
             Array.isArray(response.precincts);
    }
  },
  {
    name: 'Invalid Year Returns 404',
    endpoint: '/api/results/1900',
    method: 'GET',
    expectedStatus: 404
  },
  {
    name: 'Precinct Detail',
    endpoint: '/api/precincts/12345',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      return response.precinct_id === '12345' &&
             typeof response.turnout_pct === 'number';
    }
  }
];

// Test runner
async function runTests() {
  console.log('Starting API Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TEST_CASES) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const url = `${TEST_CONFIG.baseUrl}${testCase.endpoint}`;
      const response = await fetch(url, {
        method: testCase.method || 'GET',
        headers: testCase.headers || {},
        body: testCase.body ? JSON.stringify(testCase.body) : undefined
      });
      
      // Check status code
      if (response.status !== testCase.expectedStatus) {
        console.log(`  ✗ Expected status ${testCase.expectedStatus}, got ${response.status}`);
        failed++;
        continue;
      }
      
      // If we expect success, validate response
      if (response.ok && testCase.validate) {
        const data = await response.json();
        
        if (testCase.validate(data)) {
          console.log(`  ✓ Passed`);
          passed++;
        } else {
          console.log(`  ✗ Validation failed`);
          if (TEST_CONFIG.verbose) {
            console.log(`    Response:`, JSON.stringify(data, null, 2).split('\n').slice(0, 10).join('\n'));
          }
          failed++;
        }
      } else {
        console.log(`  ✓ Passed`);
        passed++;
      }
      
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }
  
  // Summary
  console.log('═'.repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('═'.repeat(60));
  
  return failed === 0;
}

// Run if executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests, TEST_CASES };
