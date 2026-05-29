---
name: test-api-endpoint
description: 'Test SvelteKit API endpoints with election data samples, validate JSON schema, check response times, and verify data integrity. Use when: testing API endpoints, validating election data responses, checking API performance, debugging SvelteKit routes, verifying JSON structure, or ensuring data accuracy in API responses.'
argument-hint: 'API endpoint path to test (e.g., /api/results/2024)'
---

# API Endpoint Testing

Test SvelteKit API endpoints serving election data with sample requests, schema validation, and performance checks.

## When to Use

- Testing new or modified API endpoints in `src/routes/`
- Validating JSON response structure and data types
- Checking API performance and response times
- Verifying election data accuracy in responses
- Debugging SvelteKit server route handlers
- Ensuring backwards compatibility after changes

## Prerequisites

1. SvelteKit dev server running (`npm run dev`)
2. Sample election data available in `data/` hierarchy
3. API endpoint implemented in `src/routes/`

## Test Procedure

### 1. Identify Endpoint

Determine the endpoint path and expected functionality:
- **Results by year**: `/api/results/{year}`
- **Precinct detail**: `/api/precincts/{id}`
- **County summary**: `/api/counties/{name}/summary`
- **Historical trends**: `/api/trends/{race-type}`

### 2. Prepare Test Cases

Create test scenarios based on data journalism requirements:

```javascript
// Sample test cases
const testCases = [
  {
    name: "2024 Primary Results",
    path: "/api/results/2024",
    expectedFields: ["election_date", "precincts", "total_votes", "races"],
    dataValidation: {
      total_votes: (n) => n > 0,
      precincts: (arr) => Array.isArray(arr) && arr.length > 0
    }
  },
  {
    name: "Invalid Year",
    path: "/api/results/1900",
    expectedStatus: 404
  }
];
```

### 3. Execute Tests

Run the [test script](./scripts/test-endpoint.js):

```bash
node .github/skills/test-api-endpoint/scripts/test-endpoint.js <endpoint-path>
```

Or use the [validation template](./assets/test-template.js) to create custom tests.

### 4. Validate Response Schema

Check required fields for election data:

**Standard Election Response Fields:**
- `election_date` (ISO 8601 string)
- `election_type` ("primary" | "general" | "special")
- `county` (string)
- `precincts` (array of precinct objects)
- `races` (array of race objects)
- `metadata` (object with `source`, `updated_at`, `version`)

**Precinct Object:**
- `precinct_id` (string)
- `precinct_name` (string)
- `registered_voters` (number)
- `ballots_cast` (number)
- `turnout_pct` (number, 0-100)

**Race Object:**
- `race_name` (string)
- `candidates` (array of candidate objects)
- `total_votes` (number)

### 5. Verify Data Integrity

Run integrity checks specific to election data:

```javascript
// Turnout cannot exceed 100%
assert(precinct.turnout_pct <= 100, "Invalid turnout percentage");

// Sum of candidate votes should equal race total
const candidateSum = race.candidates.reduce((sum, c) => sum + c.votes, 0);
assert(candidateSum === race.total_votes, "Vote totals don't match");

// Dates should be valid and not in future
assert(new Date(response.election_date) <= new Date(), "Future election date");
```

### 6. Performance Benchmarks

Measure and validate response times:

- **Simple queries** (single year): < 100ms
- **Complex queries** (multi-year trends): < 500ms
- **Large datasets** (all precincts): < 1000ms

Log slow queries for optimization.

### 7. Generate Test Report

Output should include:

```
✓ Endpoint: /api/results/2024
  Status: 200 OK
  Response time: 87ms
  Records: 142 precincts
  
  Schema Validation:
  ✓ All required fields present
  ✓ Data types correct
  ✓ No null values in required fields
  
  Data Integrity:
  ✓ Turnout percentages valid (0-100)
  ✓ Vote totals match sums
  ✓ Precinct IDs unique
  
  Performance:
  ✓ Response time < 100ms threshold
  
✗ Endpoint: /api/results/1900
  Status: 404 Not Found (expected)
  ✓ Proper error handling
```

## Common Issues

### Issue: Endpoint returns 500 error
**Check:**
- Data file exists at expected path
- CSV parsing doesn't fail on malformed data
- Required columns present in source data

### Issue: Missing fields in response
**Check:**
- TypeScript interface matches response structure
- Data transformation includes all fields
- No undefined values being filtered out

### Issue: Slow response times
**Check:**
- Data caching implemented
- Unnecessary database queries
- Large datasets need pagination
- Missing indexes on filtered fields

## Integration with CI

Add to `.github/workflows/test.yaml`:

```yaml
- name: Test API Endpoints
  run: npm run test:api
```

Reference the test suite in `package.json`:

```json
{
  "scripts": {
    "test:api": "node .github/skills/test-api-endpoint/scripts/test-all.js"
  }
}
```

## Best Practices

1. **Test with real data** — Use actual election CSVs from `data/`
2. **Cover edge cases** — Test missing data, invalid years, empty results
3. **Validate metadata** — Ensure source attribution and timestamps
4. **Check CORS** — Verify headers for public API access
5. **Document responses** — Update API docs with response examples
6. **Version endpoints** — Consider `/api/v1/` for breaking changes

## Related Files

- [Test script](./scripts/test-endpoint.js) — Main testing utility
- [Test template](./assets/test-template.js) — Boilerplate for new tests
- [Sample responses](./assets/sample-responses.json) — Expected response examples
- `src/routes/` — API endpoint implementations
- `package.json` — NPM scripts for testing
