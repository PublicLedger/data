#!/usr/bin/env node

/**
 * Run comprehensive API endpoint tests
 * Usage: node test-all.js [--ci]
 * 
 * In CI mode, exits with non-zero code if any tests fail
 */

const { spawn } = require('child_process');
const path = require('path');

const CI_MODE = process.argv.includes('--ci');
const SCRIPT_DIR = __dirname;
const TEST_SCRIPT = path.join(SCRIPT_DIR, 'test-endpoint.js');

// Define all endpoints to test
const ENDPOINTS = [
  // Results endpoints
  { path: '/api/results/2024', name: '2024 Results' },
  { path: '/api/results/2022', name: '2022 Results' },
  { path: '/api/results/2020', name: '2020 Results' },
  
  // Error cases
  { path: '/api/results/1900', name: 'Invalid Year (should 404)', expectFail: true },
  
  // Add more endpoints as they're implemented
  // { path: '/api/precincts/01-001', name: 'Precinct Detail' },
  // { path: '/api/counties/Lancaster/summary', name: 'County Summary' },
  // { path: '/api/trends/presidential', name: 'Presidential Trends' },
];

function runTest(endpoint) {
  return new Promise((resolve) => {
    const proc = spawn('node', [TEST_SCRIPT, endpoint.path], {
      stdio: 'inherit',
      cwd: SCRIPT_DIR
    });
    
    proc.on('close', (code) => {
      const success = endpoint.expectFail ? code !== 0 : code === 0;
      resolve({ 
        endpoint: endpoint.path, 
        name: endpoint.name,
        success, 
        exitCode: code 
      });
    });
    
    proc.on('error', (err) => {
      resolve({ 
        endpoint: endpoint.path, 
        name: endpoint.name,
        success: false, 
        error: err.message 
      });
    });
  });
}

async function runAllTests() {
  console.log('═'.repeat(60));
  console.log('Running comprehensive API endpoint tests');
  console.log('═'.repeat(60));
  console.log('');
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Test: ${endpoint.name}`);
    console.log('─'.repeat(60));
    
    const result = await runTest(endpoint);
    results.push(result);
  }
  
  // Summary
  console.log('\n\n');
  console.log('═'.repeat(60));
  console.log('TEST SUMMARY');
  console.log('═'.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(result => {
    const icon = result.success ? '✓' : '✗';
    const color = result.success ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    console.log(`${color}${icon}${reset} ${result.name}`);
  });
  
  console.log('');
  console.log(`Total: ${results.length} tests`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('═'.repeat(60));
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Review output above for details.\n');
    if (CI_MODE) {
      process.exit(1);
    }
  } else {
    console.log('\n✓ All tests passed!\n');
    if (CI_MODE) {
      process.exit(0);
    }
  }
}

// Check if dev server is running
async function checkServer() {
  const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5173';
  
  try {
    const response = await fetch(BASE_URL);
    return true;
  } catch (error) {
    console.error(`\n✗ Cannot connect to server at ${BASE_URL}`);
    console.error('  Make sure the dev server is running: npm run dev\n');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    process.exit(1);
  }
  
  await runAllTests();
})();
