#!/usr/bin/env node

/**
 * Test SvelteKit API endpoints serving election data
 * Usage: node test-endpoint.js <endpoint-path> [options]
 *
 * Example:
 *   node test-endpoint.js /api/results/2024
 *   node test-endpoint.js /api/precincts/12345 --verbose
 */

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5173";
const VERBOSE = process.argv.includes("--verbose");

// ANSI color codes for output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  dim: "\x1b[2m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(path) {
  const startTime = Date.now();
  const url = `${BASE_URL}${path}`;

  log(`\nTesting: ${url}`, "blue");

  try {
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;

    // Basic response validation
    log(`✓ Status: ${response.status} ${response.statusText}`, response.ok ? "green" : "red");
    log(
      `  Response time: ${responseTime}ms`,
      responseTime < 100 ? "green" : responseTime < 500 ? "yellow" : "red"
    );

    if (!response.ok) {
      if (VERBOSE) {
        const text = await response.text();
        log(`  Error: ${text}`, "dim");
      }
      return { success: false, status: response.status };
    }

    const data = await response.json();
    log(`  Content-Type: ${response.headers.get("content-type")}`, "dim");

    // Schema validation for election data
    const schemaResults = validateElectionSchema(data);
    log(`\n  Schema Validation:`, "blue");
    schemaResults.forEach(result => {
      log(`  ${result.pass ? "✓" : "✗"} ${result.message}`, result.pass ? "green" : "red");
    });

    // Data integrity checks
    const integrityResults = validateDataIntegrity(data);
    if (integrityResults.length > 0) {
      log(`\n  Data Integrity:`, "blue");
      integrityResults.forEach(result => {
        log(`  ${result.pass ? "✓" : "✗"} ${result.message}`, result.pass ? "green" : "red");
      });
    }

    // Performance check
    log(`\n  Performance:`, "blue");
    if (responseTime < 100) {
      log(`  ✓ Response time < 100ms threshold`, "green");
    } else if (responseTime < 500) {
      log(`  ⚠ Response time acceptable but could be optimized`, "yellow");
    } else {
      log(`  ✗ Response time exceeds 500ms - optimization needed`, "red");
    }

    if (VERBOSE) {
      log(`\n  Sample response:`, "dim");
      log(JSON.stringify(data, null, 2).split("\n").slice(0, 20).join("\n"), "dim");
      if (JSON.stringify(data).length > 1000) {
        log("  ... (truncated)", "dim");
      }
    }

    return { success: true, status: response.status, responseTime, data };
  } catch (error) {
    log(`✗ Request failed: ${error.message}`, "red");
    return { success: false, error: error.message };
  }
}

function validateElectionSchema(data) {
  const results = [];

  // Check for common election data fields
  const expectedFields = {
    election_date: "string",
    election_type: "string",
    county: "string",
  };

  for (const [field, expectedType] of Object.entries(expectedFields)) {
    if (field in data) {
      const actualType = typeof data[field];
      if (actualType === expectedType) {
        results.push({ pass: true, message: `${field}: ${actualType}` });
      } else {
        results.push({
          pass: false,
          message: `${field}: expected ${expectedType}, got ${actualType}`,
        });
      }
    } else {
      results.push({ pass: false, message: `Missing field: ${field}` });
    }
  }

  // Check array fields
  if ("precincts" in data) {
    if (Array.isArray(data.precincts)) {
      results.push({
        pass: true,
        message: `precincts: array (${data.precincts.length} items)`,
      });
    } else {
      results.push({ pass: false, message: "precincts: not an array" });
    }
  }

  if ("races" in data) {
    if (Array.isArray(data.races)) {
      results.push({
        pass: true,
        message: `races: array (${data.races.length} items)`,
      });
    } else {
      results.push({ pass: false, message: "races: not an array" });
    }
  }

  // Check metadata
  if ("metadata" in data) {
    const meta = data.metadata;
    if (typeof meta === "object") {
      const hasSource = "source" in meta;
      const hasUpdated = "updated_at" in meta;
      results.push({
        pass: hasSource && hasUpdated,
        message: `metadata: ${hasSource ? "✓ source" : "✗ no source"}, ${hasUpdated ? "✓ updated_at" : "✗ no updated_at"}`,
      });
    }
  }

  return results;
}

function validateDataIntegrity(data) {
  const results = [];

  // Validate precincts if present
  if (data.precincts && Array.isArray(data.precincts)) {
    for (const precinct of data.precincts) {
      // Check turnout percentage
      if ("turnout_pct" in precinct) {
        const valid = precinct.turnout_pct >= 0 && precinct.turnout_pct <= 100;
        if (!valid) {
          results.push({
            pass: false,
            message: `Invalid turnout: ${precinct.precinct_name} (${precinct.turnout_pct}%)`,
          });
        }
      }

      // Check that ballots cast <= registered voters
      if ("ballots_cast" in precinct && "registered_voters" in precinct) {
        const valid = precinct.ballots_cast <= precinct.registered_voters;
        if (!valid) {
          results.push({
            pass: false,
            message: `Ballots exceed registered voters: ${precinct.precinct_name}`,
          });
        }
      }
    }

    if (results.filter(r => !r.pass).length === 0) {
      results.push({ pass: true, message: "All precinct data valid" });
    }
  }

  // Validate races if present
  if (data.races && Array.isArray(data.races)) {
    for (const race of data.races) {
      if (race.candidates && race.total_votes) {
        const candidateSum = race.candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
        if (candidateSum !== race.total_votes) {
          results.push({
            pass: false,
            message: `Vote mismatch in ${race.race_name}: candidates sum ${candidateSum}, total ${race.total_votes}`,
          });
        }
      }
    }
  }

  // Validate date
  if (data.election_date) {
    const electionDate = new Date(data.election_date);
    const now = new Date();
    if (electionDate > now) {
      results.push({
        pass: false,
        message: `Future election date: ${data.election_date}`,
      });
    }
  }

  return results;
}

// Main execution
const endpoint = process.argv[2];

if (!endpoint) {
  console.error("Usage: node test-endpoint.js <endpoint-path> [--verbose]");
  console.error("Example: node test-endpoint.js /api/results/2024");
  process.exit(1);
}

testEndpoint(endpoint).then(result => {
  log(`\n${"=".repeat(60)}`, "dim");
  if (result.success) {
    log("✓ Test completed successfully", "green");
    process.exit(0);
  } else {
    log("✗ Test failed", "red");
    process.exit(1);
  }
});
