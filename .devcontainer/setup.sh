#!/bin/bash
set -e

# UV version pinned here for reproducibility
# When updating, get checksums from: https://github.com/astral-sh/uv/releases/tag/{version}
UV_VERSION="0.5.10"

# Check if system packages need installation
NEEDS_APT_UPDATE=0
if ! command -v shellcheck >/dev/null 2>&1; then
  NEEDS_APT_UPDATE=1
fi
if ! command -v gh >/dev/null 2>&1; then
  NEEDS_APT_UPDATE=1
fi

# Install system packages if needed
if [[ "$NEEDS_APT_UPDATE" -eq 1 ]]; then
  echo "📦 Installing system packages..."
  sudo apt-get update -qq
  
  if ! command -v shellcheck >/dev/null 2>&1; then
    echo "   Installing shellcheck..."
    sudo apt-get install -y -qq shellcheck
  fi
  
  if ! command -v gh >/dev/null 2>&1; then
    echo "   Installing GitHub CLI..."
    sudo apt-get install -y -qq gh
  fi
  
  echo "   ✅ System packages installed"
fi

# Check if uv needs installation or upgrade
INSTALL_PINNED_UV=0
if ! command -v uv >/dev/null 2>&1; then
  INSTALL_PINNED_UV=1
else
  INSTALLED_UV_VERSION="$(uv --version 2>/dev/null | awk '{print $2}')"
  if [[ "${INSTALLED_UV_VERSION}" != "${UV_VERSION}" ]]; then
    INSTALL_PINNED_UV=1
  fi
fi

if [[ "${INSTALL_PINNED_UV}" -eq 1 ]]; then
  echo "🔒 Installing UV ${UV_VERSION}..."
  
  case "$(uname -m)" in
    x86_64)
      UV_ARCHIVE="uv-x86_64-unknown-linux-gnu.tar.gz"
      UV_SHA256="13452b7a99d953e970ec52861de03f6f2e00bfee2c4357bc63c292a70472b386"
      ;;
    aarch64)
      UV_ARCHIVE="uv-aarch64-unknown-linux-gnu.tar.gz"
      UV_SHA256="f4316a657c964994d7eb736ba875f3f685c4b61e961f514e98fb50ed181da72a"
      ;;
    *)
      echo "Error: unsupported architecture: $(uname -m)" >&2
      exit 1
      ;;
  esac

  UV_URL="https://github.com/astral-sh/uv/releases/download/${UV_VERSION}/${UV_ARCHIVE}"
  TMP_UV_ARCHIVE="$(mktemp)"
  TMP_UV_DIR="$(mktemp -d)"

  trap 'rm -f "${TMP_UV_ARCHIVE:-}"; rm -rf "${TMP_UV_DIR:-}"' EXIT

  curl -LsSf -o "${TMP_UV_ARCHIVE}" "${UV_URL}"
  echo "${UV_SHA256}  ${TMP_UV_ARCHIVE}" | sha256sum -c -

  mkdir -p "$HOME/.local/bin"
  tar -xzf "${TMP_UV_ARCHIVE}" -C "${TMP_UV_DIR}"

  UV_BIN_PATH="$(find "${TMP_UV_DIR}" -type f -name uv | head -n 1)"
  if [[ -z "${UV_BIN_PATH}" ]]; then
    echo "Error: could not find uv binary in ${UV_ARCHIVE}" >&2
    exit 1
  fi

  install -m 0755 "${UV_BIN_PATH}" "$HOME/.local/bin/uv"
  
  echo "   ✅ UV ${UV_VERSION} installed successfully"
  echo "   SHA256: ${UV_SHA256}"
fi

# Ensure user-level binaries are available in this shell
export PATH="$HOME/.local/bin:$PATH"

echo ""
echo "📦 Installing Python dependencies with uv sync..."
# Install project dependencies
uv sync

echo ""
echo "🐍 Registering Jupyter kernel..."
# Register the Jupyter kernel
uv run python -m ipykernel install \
    --user --name=publicledger_data \
    --display-name='Public Ledger - Data API'

echo ""
echo "✅ Dev container setup complete!"
echo "   Python: $(python3 --version)"
echo "   UV: $(uv --version 2>/dev/null || echo 'not in PATH yet')"
echo ""
