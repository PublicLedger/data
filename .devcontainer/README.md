# Dev Container Configuration

This directory contains the development container configuration for reproducible builds.

## Files

- **devcontainer.json** - Main configuration defining the container setup
- **devcontainer-lock.json** - VS Code-managed lock file for devcontainer features (auto-generated)
- **setup.sh** - Post-creation script that installs UV and project dependencies

## Version Pinning

### Devcontainer Features (devcontainer-lock.json)

The `devcontainer-lock.json` is **automatically managed by VS Code** and locks devcontainer features (like Node.js) with their SHA256 digests. Don't manually edit this file.

### UV Package Manager (setup.sh)

UV version and checksums are pinned at the top of `setup.sh`:

```bash
UV_VERSION="0.5.10"
UV_X86_SHA256="13452b7a99d953e970ec52861de03f6f2e00bfee2c4357bc63c292a70472b386"
UV_AARCH64_SHA256="f4316a657c964994d7eb736ba875f3f685c4b61e961f514e98fb50ed181da72a"
```

### Python Packages (uv.lock)

Python dependencies are locked in `uv.lock` at the repo root (managed by `uv sync`).

## Updating Versions

**To update UV:**

1. Edit version and checksums at top of `setup.sh`
2. Get checksums from: `https://github.com/astral-sh/uv/releases/tag/{version}`
3. Rebuild container to test

**To update Python packages:**

```bash
uv lock --upgrade      # Update uv.lock
uv sync               # Install updated packages
```

## Environment Variables

Set in `devcontainer.json`:

- `INSTALL_PINNED_UV=1` - Triggers UV installation from pinned version
- `PATH` includes `~/.local/bin` for user-installed binaries

## Post-Creation Flow

1. Container starts with Python 3.13 base image
2. Node.js feature installs (locked by devcontainer-lock.json)
3. `setup.sh` runs:
   - Installs GitHub CLI if needed
   - Downloads UV from pinned version with SHA256 verification
   - Installs UV to `~/.local/bin`
   - Runs `uv sync` to install Python dependencies from uv.lock
   - Registers Jupyter kernel

## Troubleshooting

**UV not found**: Ensure `INSTALL_PINNED_UV=1` is set in `devcontainer.json`

**Package missing**: Run `uv sync` from repo root, then restart kernel

**Wrong Python version**: Check `python.defaultInterpreterPath` points to `.venv/bin/python`

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
