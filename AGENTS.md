# AGENTS.md

Instructions for AI coding assistants working on the Public Ledger data API project.

## Project Overview

Public Ledger data API — a public-facing data journalism platform serving Pennsylvania election results through SvelteKit APIs and data visualizations. This repository handles the complete data pipeline from scraping county election sites to serving structured JSON endpoints.

**This is production infrastructure serving public data.** Accuracy and reliability are critical.

## Development Principles (AI Agent Guidance)

Common patterns that lead to wasted time and repeated mistakes:

### 1. Test Isolation
Tests must not modify production files. Verify test scripts use proper temp directories and can't affect real project files through `cd` operations or absolute paths.

### 2. Validation Consistency  
All validation paths (npm scripts, pre-commit hooks, CI workflows) must use identical tooling and file patterns. Mismatches create "passes locally, fails in CI" scenarios.

### 3. Configuration Completeness
Environment-specific configs must cover all file types and execution contexts. Check that linting rules, globals, and type definitions match actual usage patterns.

### 4. Simplicity Over Complexity
Prefer simple solutions (package manager installs) over complex abstractions (custom features/wrappers) when functionality is equivalent. Complexity has maintenance cost.

### 5. Atomic Multi-File Operations
Scripts updating multiple files (versions, configs) must do so atomically with validation. Add safeguards against unrealistic inputs and provide single source of truth.

### 6. Progressive Safeguards
Layer multiple validation checks at different levels to catch different error types. One safeguard may miss edge cases another catches.

### 7. Dependency Due Diligence
Verify third-party tools and packages are actively maintained before adoption. Check last commit dates, deprecation notices, and migration paths.

### 8. Documentation-First Actions
**Consult existing documentation and constraints before implementing changes.** Check AGENTS.md, README.md, and config files for warnings about forbidden patterns or known issues.

### 9. Environment Auditing
Understand execution context before writing code:
- What strictness modes are enabled? (bash `set -u`, PHPUnit `beStrictAbout*`, etc.)
- What contracts does the caller expect? (exit codes, output silence, specific formats)
- What dependencies must exist first? (variables initialized, functions defined, commands available)

### 10. Measure What Matters
Ensure tests and metrics measure production code, not test infrastructure or mocks. High coverage of test doubles provides false confidence.

### 11. Error Signal Clarity
Avoid patterns that mask failures or bury important output:
- Shell logic (`&& ||` chains) that hides exit codes
- Development tool noise drowning out test results  
- Conditional logic with incorrect fallback paths

### 12. Tool Configuration Alignment
Development tools must match containerized and production environments. Document required paths, stubs, and environment-specific settings.

---

## Tech Stack

### Frontend & API
- **SvelteKit** — SSG/SPA framework serving static build and API routes
- **TypeScript** — Type-safe API endpoints and utilities
- **Vite** — Build tool and dev server
- **Vitest** — Testing framework

### Data Pipeline
- **Python 3.13+** — Data scraping and processing
- **Jupyter Lab** — Interactive data exploration notebooks
- **pandas** — Data manipulation and analysis
- **pytest** — Data validation testing
- **uv** — Python dependency management

### Quality & Automation
- **ESLint** — JavaScript/TypeScript linting
- **Prettier** — Code formatting
- **Ruff** — Python linting and formatting
- **pre-commit** — Git hooks for quality checks

## Setup

### SvelteKit Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build static site
npm run preview      # Preview production build
npm test             # Run test suite
```

### Python Data Pipeline

```bash
uv sync              # Install Python dependencies
jupyter lab          # Launch notebook environment
```

### Quality Checks

```bash
npm run lint         # Check code style
npm run lint:fix     # Auto-fix linting issues
npm run check        # Svelte type checking
npm run notebooks:strip         # Strip notebook outputs
npm run notebooks:check-clean   # Verify notebooks are clean
```

## Data Journalism Conventions

### Scraping Ethics

**Always respect source site policies:**
- Check robots.txt before scraping any domain
- Use custom UserAgent: `PublicLedgerBot/1.0 (+https://publicledger.news/; info@publicledger.news)`
- Add 1-2 second delays between requests
- Cache responses to avoid duplicate requests
- Scrape during off-peak hours when possible
- Contact webmasters for large-scale scraping

### Data Quality Standards

- Verify totals match official sources
- Check for duplicate or missing precincts
- Validate date formats and election types
- Ensure historical consistency
- Document all data sources and transformations
- Include metadata (source, updated_at, version) in outputs

### Notebook Hygiene

**Critical:** Notebooks can contain sensitive data or credentials

```bash
npm run notebooks:strip        # Strip outputs before committing
npm run notebooks:check-clean  # Verify notebooks are clean
```

**Never commit notebooks with outputs.** Use pre-commit hooks to enforce this.

## API Development

### Endpoint Patterns (Projected)

API routes follow SvelteKit conventions in `src/routes/`:

```
src/routes/
  api/
    results/
      [year]/+server.ts        # /api/results/2024
    precincts/
      [id]/+server.ts          # /api/precincts/01-001
    counties/
      [name]/
        summary/+server.ts     # /api/counties/Lancaster/summary
```

### Response Format

All API responses must include metadata:

```typescript
{
  "election_date": "2024-05-16",
  "election_type": "primary",
  "county": "Lancaster",
  "precincts": [...],
  "races": [...],
  "metadata": {
    "source": "Lancaster County Board of Elections",
    "source_url": "https://...",
    "updated_at": "2024-05-17T08:30:00Z",
    "version": "1.0"
  }
}
```

### Testing APIs

Use the `test-api-endpoint` skill:

```bash
/test-api-endpoint /api/results/2024
```

Or run directly:

```bash
node .github/skills/test-api-endpoint/scripts/test-endpoint.js /api/results/2024
```

## Code Style

### TypeScript/JavaScript

- 2-space indentation
- No semicolons (configured in Prettier)
- Trailing commas in objects/arrays
- Arrow functions preferred over function expressions
- Use const/let, never var

### Python (Notebooks)

- 2-space indentation in notebooks (not 4)
- Modern type hints: `list[str]`, `dict[str, int]`, `X | None`
- Use pandas for data manipulation
- Use tqdm for progress bars
- Handle secrets via environment variables

### Markdown

- No periods in bullet points (unless multi-sentence)
- No Oxford commas (unless needed for clarity)
- Use asterisks for lists, not dashes
- Concise writing — avoid verbosity

## Testing

### TypeScript Tests

```bash
npm test                 # Run all tests
npm run test:coverage    # With coverage report
```

### Python Data Validation

```bash
uv run pytest tests/ -v
```

### Pre-commit Hooks

```bash
pre-commit run --all-files
```

Hooks enforce:
- Ruff lint and format (Python)
- Trailing whitespace removal
- End-of-file fixer
- YAML/TOML/JSON validation
- Large file guards (99 MB limit)

## Custom Agents

This project includes specialized AI agents in `.github/agents/`:

### Public Ledger Data Pipeline

Invoke with `@publicledger` for:
- Election data scraping and processing
- Data quality validation
- API endpoint development
- Notebook organization and cleanup

See [.github/agents/data-journalism.agent.md](.github/agents/data-journalism.agent.md) for details.

## Deployment

GitHub Actions (`.github/workflows/`) handles CI/CD:

1. **Test** — Run TypeScript and Python test suites
2. **Build** — `npm run build` generates static site
3. **Deploy** — Upload to hosting (main branch only)

## Communication Guidelines

### For Developers
- Technical precision, reference specific files/functions
- Use conventional commit messages
- Document breaking changes clearly

### For Journalists/Editors
- Plain language explanations
- Focus on editorial impact and data accuracy
- Avoid unnecessary jargon

### For Data Reporters
- Balance technical accuracy with accessibility
- Provide reproducible examples
- Cite sources and methodology

## Related Resources

- **Project site:** https://data.publicledger.news
- **Organization:** https://publicledger.news
- **Repository:** https://github.com/PublicLedger/data