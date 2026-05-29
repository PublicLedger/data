# API Endpoint Testing Skill

Test SvelteKit API endpoints serving Pennsylvania election data with automated validation, schema checking, and performance benchmarking.

## Quick Start

### Using as a Copilot Skill

In GitHub Copilot chat, invoke with:

```
/test-api-endpoint /api/results/2024
```

The AI agent will use this skill to test your endpoint comprehensively.

### Direct Script Usage

Test a single endpoint:

```bash
node scripts/test-endpoint.js /api/results/2024
```

With verbose output:

```bash
node scripts/test-endpoint.js /api/results/2024 --verbose
```

Run all endpoint tests:

```bash
node scripts/test-all.js
```

CI mode (exits with error code on failure):

```bash
node scripts/test-all.js --ci
```

## Files

- **SKILL.md** — Instructions for AI agent on how to use this skill
- **scripts/test-endpoint.js** — Main testing utility for single endpoints
- **scripts/test-all.js** — Run comprehensive test suite on all endpoints
- **assets/test-template.js** — Boilerplate for creating custom tests
- **assets/sample-responses.json** — Expected response formats and schemas

## What Gets Tested

### 1. HTTP Response
- Status code (200, 404, etc.)
- Response time benchmarking
- Content-Type headers

### 2. JSON Schema
- Required fields present
- Correct data types
- Array structures
- Metadata completeness

### 3. Data Integrity
- Turnout percentages (0-100%)
- Vote totals match candidate sums
- Ballots ≤ registered voters
- Dates are valid and not in future
- Precinct IDs are unique

### 4. Performance
- Simple queries: < 100ms
- Complex queries: < 500ms
- Large datasets: < 1000ms

## Customization

### Add New Endpoints to Test Suite

Edit `scripts/test-all.js`:

```javascript
const ENDPOINTS = [
  { path: '/api/results/2024', name: '2024 Results' },
  { path: '/api/your-new-endpoint', name: 'Your Endpoint' },
];
```

### Create Custom Test Logic

Copy `assets/test-template.js` and modify validation functions:

```javascript
validate: (response) => {
  // Your custom validation logic
  return response.custom_field === 'expected_value';
}
```

## Integration with package.json

Add to your scripts:

```json
{
  "scripts": {
    "test:api": "node .github/skills/test-api-endpoint/scripts/test-all.js",
    "test:api:ci": "node .github/skills/test-api-endpoint/scripts/test-all.js --ci"
  }
}
```

Then run:

```bash
npm run test:api
```

## Expected Response Formats

See `assets/sample-responses.json` for complete examples of:

- Election results (with precincts and races)
- Precinct detail
- County summaries
- Historical trends
- Error responses

## Environment Variables

- `API_BASE_URL` — Base URL for API (default: `http://localhost:5173`)

Example:

```bash
API_BASE_URL=https://data.publicledger.news node scripts/test-endpoint.js /api/results/2024
```
