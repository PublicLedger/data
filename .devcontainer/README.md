# Dev Container Configuration

This directory contains the development container configuration for reproducible builds.

## Files

- **devcontainer.json** - Main configuration defining the container setup
- **setup.sh** - Post-creation script that installs system tools, UV, and project dependencies

## Version Pinning

### UV Package Manager (setup.sh)

UV version and checksums are pinned at the top of `setup.sh`:

```bash
UV_VERSION="0.5.10"
```

The script automatically:
- Checks if UV is already installed
- Compares installed version to required version
- Only installs/upgrades if needed
- Verifies downloads with SHA256 checksums (architecture-specific)

### Python Packages (uv.lock)

Python dependencies are locked in `uv.lock` at the repo root (managed by `uv sync`).

## Updating Versions

**To update UV:**

1. Edit `UV_VERSION` at top of `setup.sh`
2. Get SHA256 checksums from: `https://github.com/astral-sh/uv/releases/tag/{version}`
3. Update both architecture checksums in the case statement
4. Rebuild container to test

**To update Python packages:**

```bash
uv lock --upgrade      # Update uv.lock
uv sync               # Install updated packages
```

## VS Code Extensions

The devcontainer automatically installs these extensions:

**Development:**
- Prettier (code formatting)
- ESLint (JavaScript/TypeScript linting)
- YAML (workflow validation)
- GitHub Pull Requests

**Python & Data:**
- Python + Pylance
- Jupyter (core + keymap + renderers + cell tags + slideshow)

**Testing:**
- Vitest Explorer (test running and coverage visualization)

## Environment Variables

Set in `devcontainer.json`:

- `PATH` includes `~/.local/bin` for user-installed binaries (UV, shellcheck, gh)

## Post-Creation Flow

1. Container starts with Python 3.13 base image
2. Node.js LTS feature installs via devcontainer features
3. `setup.sh` runs:
   - Checks if system packages need installation (shellcheck, gh)
   - Runs `apt-get update` only if packages are missing
   - Installs shellcheck (for pre-commit hooks) if needed
   - Installs GitHub CLI if needed
   - Checks if UV is installed and at correct version
   - Downloads UV from pinned version with SHA256 verification (if needed)
   - Installs UV to `~/.local/bin`
   - Runs `uv sync` to install Python dependencies from uv.lock
   - Registers Jupyter kernel with display name "Public Ledger - Data API"

The setup script is idempotent — it only installs what's missing or outdated, making rebuilds faster.

## Troubleshooting

**UV not found**: Check that `~/.local/bin` is in your PATH. Run `source ~/.bashrc` or restart the terminal.

**Package missing**: Run `uv sync` from repo root, then restart kernel

**Wrong Python version**: Check `python.defaultInterpreterPath` in `.vscode/settings.json` points to `.venv/bin/python`

**Shellcheck not found**: Rebuild the container — shellcheck installs automatically via `setup.sh`

**Tests not showing in sidebar**: Ensure Vitest extension (`vitest.explorer`) is installed and enabled in settings

## Common Operations

### Restart Dev Container

When you've changed devcontainer configuration:

1. Press `F1` (or `Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type: `Dev Containers: Rebuild Container`
3. Press Enter

Or for a full rebuild without cache:

1. Press `F1`
2. Type: `Dev Containers: Rebuild Container Without Cache`
3. Press Enter

### Restart Jupyter Kernel

When you've installed new packages or need to reload imports:

1. In notebook toolbar, click the kernel name (e.g., "Public Ledger - Data API")
2. Select `Restart Kernel`

Or use keyboard:

- Press `F1`
- Type: `Notebook: Restart Kernel`
- Press Enter

Or from command palette:

- Press `F1`
- Type: `Jupyter: Restart Kernel`
- Press Enter

### Run Tests with Coverage

To generate a coverage report:

```bash
npm run test:coverage
```

This creates:
- Terminal summary with coverage percentages
- HTML report: `coverage/index.html` (open in browser)
- LCOV report: `coverage/lcov.info` (for CI integration)

The Vitest extension also shows inline coverage indicators in the editor when tests run.
