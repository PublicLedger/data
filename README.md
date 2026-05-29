# Public Ledger > Data API

| badge | status |
| --- | --- |
| Tests on `main` | [![Continuous Integration](https://github.com/PublicLedger/data/actions/workflows/ci.yml/badge.svg)](https://github.com/PublicLedger/data/actions/workflows/ci.yml) |
| Releases on `main` | [![Release](https://github.com/PublicLedger/data/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/PublicLedger/data/actions/workflows/release.yml) |

Public-facing data journalism platform serving Pennsylvania election results through SvelteKit APIs and data visualizations. This repository handles the complete data pipeline from scraping county election sites to serving structured JSON endpoints.

**This is production infrastructure serving public data.** Accuracy and reliability are critical.

## Tech Stack

### Frontend & API
- **SvelteKit** — SSG/SPA framework serving static build and API routes
- **TypeScript** — Type-safe API endpoints and utilities
- **Vite** — Build tool and dev server
- **Vitest** — Testing framework with coverage

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

## Quick Start

### SvelteKit Development

```sh
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build static site
npm run preview      # Preview production build
npm test             # Run test suite
npm run test:coverage  # Run tests with coverage report
```

### Python Data Pipeline

```sh
uv sync              # Install Python dependencies
jupyter lab          # Launch notebook environment
```

**Notebook Kernel:** Notebooks use the Python 3.13 kernel from `.venv/`. The devcontainer setup script automatically configures this kernel via `ipykernel`.

### Quality Checks

```sh
npm run lint         # Check code style
npm run lint:fix     # Auto-fix linting issues
npm run check        # Svelte type checking
npm run format       # Format all code with Prettier
npm run notebooks:strip         # Strip notebook outputs
npm run notebooks:check-clean   # Verify notebooks are clean
```

## Project Structure

```text
data/
├── .devcontainer/                          # Dev container config & setup script
├── .github/
│   ├── agents/                             # Custom AI agents (@publicledger)
│   ├── skills/                             # Reusable AI workflows (test-api-endpoint)
│   └── workflows/                          # CI/CD automation
│       ├── ci.yml                          # Test & lint checks on PRs
│       └── release.yml                     # Automated release & deployment
├── build/                                  # Static site output (generated)
├── data/
│   └── raw_notebook_csvs/                  # Scraped election data
│       ├── county/Lancaster/               # County-level election results
│       │   ├── 2024/
│       │   ├── 2025/
│       │   └── 2026/
│       └── state/Lancaster/                # State-level results for Lancaster
│           ├── 2012/
│           ├── 2013/
│           └── ...
├── notebooks/                              # Python notebooks for data acquisition
│   ├── Lancaster_county_scraper.ipynb
│   ├── PA_state_scraper_county_specific.ipynb
│   ├── shared_setup.py                     # Reusable notebook utilities
│   └── shared_table_display.py             # Standardized data table formatting
├── scripts/                                # Utility scripts
│   ├── check-notebooks-clean.sh            # Verify notebooks have no outputs
│   └── strip-notebook-outputs.sh           # Remove outputs before commit
├── src/                                    # SvelteKit application source
│   ├── routes/                             # SvelteKit routes and API endpoints
│   │   ├── +page.svelte                    # Homepage
│   │   ├── robots.txt/+server.ts           # robots.txt endpoint
│   │   └── sitemap.xml/+server.ts          # Sitemap endpoint
│   └── lib/                                # Shared components and utilities
│       ├── Link.svelte
│       ├── NorefLink.svelte
│       └── utils.ts
├── static/                                 # Static assets (favicon, etc.)
├── tests/                                  # Vitest test suite
│   ├── build-files.test.ts                 # Build output validation
│   ├── layout.test.ts                      # Layout component tests
│   ├── page.test.ts                        # Page component tests
│   └── ...
├── .gitignore
├── .pre-commit-config.yaml                 # Pre-commit hook configuration
├── AGENTS.md                               # Development principles & AI guidance
├── eslint.config.js                        # ESLint configuration
├── package.json                            # npm dependencies & scripts
├── prettier.config.js                      # Prettier code formatting config
├── pyproject.toml                          # Python dependencies (uv)
├── README.md                               # This file
├── svelte.config.js                        # SvelteKit configuration
├── tsconfig.json                           # TypeScript configuration
├── vite.config.ts                          # Vite build configuration
└── vitest-setup.ts                         # Vitest test setup
```

## Data Acquisition

### Jupyter Notebooks

Election data is scraped using Jupyter notebooks in the `notebooks/` directory:

- **Lancaster_county_scraper.ipynb** — Scrapes Lancaster County election results
- **PA_state_scraper_county_specific.ipynb** — Scrapes statewide results for specific counties

Shared utilities:
- **shared_setup.py** — Common imports, paths, and configuration
- **shared_table_display.py** — Standardized data table formatting

**Python Kernel:** All notebooks require the Python 3.13 kernel from `.venv/` which includes pandas, requests, and other data processing libraries.

### Static Data Sources

Future data will come from static uploaded CSVs that have been hand-cleaned across the history of this project. More details about those files will be added soon.

### Running Scrapers

```sh
jupyter lab  # Opens notebook environment
```

Navigate to the appropriate notebook and run cells to scrape latest data. Results are saved to `data/raw_notebook_csvs/`.

**Kernel Selection:** Ensure the notebook is using the Python 3.13 kernel from `.venv/`. In Jupyter Lab, check the kernel indicator in the top-right corner. If needed, select **Kernel** → **Change Kernel** → **Python 3.13 (.venv)**.

For now, these scrapers are NOT automated. They must be run manally by staff during election events to pull in a new election and move the data into our pipeline and Data Lake. Signals and anti-bot technology within State and County websites make it challenging to setup scrapers on cron.

### Notebook Hygiene

**Critical:** Notebooks can contain sensitive data or credentials

```bash
npm run notebooks:strip        # Strip outputs before committing
npm run notebooks:check-clean  # Verify notebooks are clean
```

**Never commit notebooks with outputs.** Pre-commit hooks enforce this automatically.

### Data Storage

Scraped data is organized in `data/raw_notebook_csvs/`:

```text
raw_notebook_csvs/
├── county/Lancaster/            # County election results
│   ├── 2024/
│   ├── 2025/
│   └── 2026/
└── state/Lancaster/             # State results for Lancaster County
    ├── 2012/
    ├── 2013/
    └── ...
```

Each directory contains CSV files with election results, metadata, and README files documenting data sources.

## API Development

### Endpoint Patterns

API routes follow SvelteKit conventions in `src/routes/`:

```text
src/routes/
├── api/
│   ├── results/
│   │   └── [year]/+server.ts        # /api/results/2024
│   ├── precincts/
│   │   └── [id]/+server.ts          # /api/precincts/01-001
│   └── counties/
│       └── [name]/
│           └── summary/+server.ts   # /api/counties/Lancaster/summary
```

### Response Format (Projected)

All API responses include metadata:

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

Use the `test-api-endpoint` skill for comprehensive endpoint testing:

```bash
node .github/skills/test-api-endpoint/scripts/test-endpoint.js /api/results/2024
```

Or in VS Code with Copilot:

```
/test-api-endpoint /api/results/2024
```

## Testing

### TypeScript Tests

```bash
npm test                 # Run all tests
npm run test:coverage    # With coverage report (HTML in coverage/)
```

Test files in `tests/` validate:
- API endpoint responses
- Component rendering
- Data utility functions
- Build output (static files, compression)

Coverage thresholds:
- 95% statements, functions, lines
- 78% branches

### Python Data Validation

```bash
uv run pytest tests/ -v
```

### Installing Pre-commit Hooks

Pre-commit hooks automatically run quality checks before each commit:

```bash
# Install hooks (one-time setup)
uv tool install pre-commit
pre-commit install
```

Hooks enforce:
- Ruff lint and format (Python)
- ESLint and Prettier (TypeScript/JavaScript)
- Notebook output stripping
- Trailing whitespace removal
- YAML/TOML/JSON validation
- Large file guards (99 MB limit)

Manually run all hooks:

```bash
pre-commit run --all-files
```

### Continuous Integration (CI) Checks

The `.github/workflows/ci.yml` workflow runs on all pull requests and pushes to `main`:

1. **Lint checks:** `npm run lint` (Prettier, ESLint, notebook cleanliness)
2. **TypeScript tests:** `npm test` (Vitest with 79 tests)
3. **Type checking:** `npm run check` (Svelte type validation)

Test results appear in GitHub Checks on PRs, providing immediate feedback before merge. All checks must pass before merging to `main`.

### Development Workflow

Before committing changes:

```bash
# Run all checks (same as CI)
npm run lint
npm run check
npm test

# Or run pre-commit hooks manually
pre-commit run --all-files
```

## Automated Maintenance

### Dependabot Configuration

This repo uses Dependabot (`.github/dependabot.yml`) for automated dependency management:

| Ecosystem | Frequency | Notes |
|-----------|-----------|-------|
| `npm` | Weekly | SvelteKit, Vite, Vitest, and dev tools |
| `github-actions` | Weekly | Workflow dependency updates |
| `pip` | Disabled | Python deps manually maintained via `uv` |

Dependabot PRs can be auto-merged after CI passes, enabling frequent maintenance with minimal manual intervention.

### Automated Release Workflow

On every push to `main`, `.github/workflows/release.yml` executes:

1. **Lint checks:** Runs `npm run lint`
2. **Test execution:** Runs `npm test`
3. **Version increment:** Computes next version from commit messages:
   - `[major]` → v1.0.0 → v2.0.0
   - `[minor]` → v1.0.0 → v1.1.0
   - `patch` (default) → v1.0.0 → v1.0.1
4. **Version sync:** Updates `package.json` and `package-lock.json`
5. **Build:** Generates static site via `npm run build`
6. **GitHub Release:** Publishes release with auto-generated notes
7. **Deploy:** Uploads to GitHub Pages
8. **Tag updates:** Maintains floating `latest` and `vX` tags

**Infinite loop prevention:** Commits with `[skip ci]` bypass the workflow.

**Developer workflow benefits:**
- Merge PR → automatic version bump and release
- No manual version file editing
- Tests run automatically before release
- Safe for Dependabot auto-merge after CI passes

## Code Style

### TypeScript/JavaScript

- 2-space indentation
- No semicolons (Prettier)
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
- Use asterisks for lists, not dashes
- Concise writing — avoid verbosity

## Data Journalism Ethics

**Always respect source site policies:**
- Check robots.txt before scraping any domain
- Use custom UserAgent: `PublicLedgerBot/1.0 (+https://publicledger.news/; info@publicledger.news)`
- Add 1-2 second delays between requests
- Cache responses to avoid duplicate requests
- Scrape during off-peak hours when possible
- Contact webmasters for large-scale scraping

**Data Quality Standards:**
- Verify totals match official sources
- Check for duplicate or missing precincts
- Validate date formats and election types
- Ensure historical consistency
- Document all data sources and transformations
- Include metadata (source, updated_at, version) in outputs

## Custom AI Agents

This project includes specialized AI agents in `.github/agents/`:

### @publicledger Agent

Invoke with `@publicledger` for:
- Election data scraping and processing
- Data quality validation
- API endpoint development
- Notebook organization and cleanup

See [AGENTS.md](AGENTS.md) for development principles and detailed guidance.

## Development Notes

### Coding Standards

**TypeScript/JavaScript:**
- Follow SvelteKit conventions for file-based routing
- Use TypeScript for type safety in API routes
- Prefix utility functions with descriptive namespaces
- Use JSDoc comments for complex functions

**Python (Notebooks):**
- Follow PEP 8 style guidelines (enforced by Ruff)
- Use type hints for function signatures
- Document data sources and transformations
- Include cell markdown explaining analysis steps

**Markdown/Documentation:**
- Keep README sections concise and scannable
- Link to detailed docs in subdirectories
- Update docs when changing workflows or APIs
- Follow style guide in `.instructions.md` files

### Version Management

- **Never manually edit version numbers** — the automated release workflow handles this
- All version references are synced automatically on merge to `main`
- `package.json` version is the single source of truth
- Semantic versioning follows conventional commits

**Manual version sync** (for emergency fixes only):
```bash
# Update package.json, then:
npm install --package-lock-only
git add package.json package-lock.json
git commit -m "chore: bump version to X.Y.Z"
```

### Development Environment

- Use the VS Code devcontainer for consistent Python/Node.js environment
- Pre-commit hooks enforce code quality and linting
- All dependencies managed via `package.json` (npm) and `pyproject.toml` (uv)
- GitHub Actions CI validates all changes before merge

**Devcontainer includes:**
- Python 3.13 with uv package manager
- Node.js LTS with npm
- Jupyter Lab for notebooks
- All linting and testing tools
- VS Code extensions for development

**Key configuration files:**
- `.devcontainer/devcontainer.json` — Container features and VS Code extensions
- `.devcontainer/setup.sh` — Post-create setup script
- `.pre-commit-config.yaml` — Pre-commit hook configuration
- `AGENTS.md` — Development principles and AI agent guidance

## Deployment

This site is automatically deployed to GitHub Pages at `data.publicledger.news`.

### GitHub Pages Setup

Ensure GitHub Pages is configured in repository settings:

1. Go to **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to "GitHub Actions"

### CI/CD Workflow

The deployment workflow (`.github/workflows/release.yml`) runs on every push to `main`:

1. **Version Detection** — Reads commit messages for versioning hints:
   - `[major]` → v1.0.0 → v2.0.0
   - `[minor]` → v1.0.0 → v1.1.0
   - `patch` (default) → v1.0.0 → v1.0.1

2. **Quality Gates** — Runs linting and full test suite

3. **Build** — Generates static site with `npm run build`

4. **Release** — Creates GitHub Release with auto-incremented tag

5. **Deploy** — Uploads `build` directory to GitHub Pages
   - CNAME file ensures site is served at `data.publicledger.news`

6. **Tagging** — Pushes floating tags (`latest`, `v{major}`) for convenience

Commits with `[skip ci]` in the message bypass the workflow.

## Development Container

This project includes a VS Code devcontainer for reproducible development environments:

```sh
# Rebuild container after pulling changes
Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

The devcontainer includes:
- Python 3.13 with uv package manager
- Node.js LTS with npm
- Jupyter Lab for notebooks with Python 3.13 kernel (`.venv/`)
- All VS Code extensions (ESLint, Prettier, Python, Vitest, etc.)
- Pre-configured linting and formatting on save

See [.devcontainer/README.md](.devcontainer/README.md) for details.

## Troubleshooting

### Common Issues and Solutions

**Tests failing locally but passing in CI**
- **Symptoms:** `npm test` fails, but GitHub Actions CI passes
- **Causes:** Stale dependencies, environment differences
- **Solutions:**
  - Run `npm install` to update dependencies
  - Rebuild devcontainer: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"
  - Clear Vitest cache: `rm -rf node_modules/.vitest`
  - Check Node.js version matches CI (should be LTS)

**Linting errors after pull**
- **Symptoms:** `npm run lint` fails on files you didn't change
- **Causes:** Prettier/ESLint version updates, new rules
- **Solutions:**
  - Run `npm run lint:fix` to auto-fix issues
  - Run `npm run format` to apply Prettier formatting
  - Check `.eslintrc` and `prettier.config.js` for rule changes

**Notebook kernel not found**
- **Symptoms:** Jupyter can't find Python 3.13 kernel
- **Causes:** Missing ipykernel installation, `.venv` not configured
- **Solutions:**
  - Run `uv sync` to install dependencies including ipykernel
  - Restart Jupyter Lab
  - In Jupyter, select **Kernel** → **Change Kernel** → **Python 3.13 (.venv)**
  - Verify `.venv/bin/python --version` shows Python 3.13

**Build failing with module errors**
- **Symptoms:** `npm run build` fails with import/module errors
- **Causes:** Missing dependencies, TypeScript errors
- **Solutions:**
  - Run `npm run check` to see type errors
  - Run `npm install` to ensure dependencies are installed
  - Check `src/` for incorrect import paths
  - Verify `vite.config.ts` and `svelte.config.js` are correct

**Pre-commit hooks failing**
- **Symptoms:** Git commit blocked by pre-commit hook errors
- **Causes:** Notebook outputs not stripped, linting errors
- **Solutions:**
  - Run `npm run notebooks:strip` to clean notebooks
  - Run `npm run lint:fix` to fix linting issues
  - Run `pre-commit run --all-files` to see all issues
  - Use `git commit --no-verify` only in emergencies

**GitHub Pages deployment not updating**
- **Symptoms:** Site not reflecting latest changes after merge
- **Causes:** Workflow failure, cache issues, DNS propagation
- **Solutions:**
  - Check Actions tab for workflow errors
  - Verify `CNAME` file contains `data.publicledger.news`
  - Wait 5-10 minutes for DNS propagation
  - Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
  - Check repository Settings → Pages for deployment status

**Coverage report not generating**
- **Symptoms:** `npm run test:coverage` completes but no `coverage/` directory
- **Causes:** Vitest configuration issues
- **Solutions:**
  - Check `vitest.config.ts` has `coverage` configuration
  - Ensure `@vitest/coverage-v8` is installed: `npm install`
  - Run `rm -rf coverage && npm run test:coverage`
  - Check console output for coverage provider errors

## Related Resources

- **Project site:** https://data.publicledger.news
- **Organization:** https://publicledger.news
- **Repository:** https://github.com/PublicLedger/data

## Contributing

See [AGENTS.md](AGENTS.md) for development principles and AI agent guidance.

For major changes:
1. Open an issue to discuss proposed changes
2. Follow code style guidelines
3. Add tests for new functionality
4. Ensure all quality checks pass
5. Update documentation as needed
