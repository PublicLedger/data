"""Shared setup utilities for data analysis notebooks."""

import shutil
import subprocess
import sys
from IPython.display import HTML, display


def check_dependencies():
    """Verify required packages are importable."""
    # Get Python version
    python_version = sys.version.split()[0]
    
    # Get UV version if available
    uv_version = "not installed"
    uv_path = shutil.which('uv')
    if uv_path:
        try:
            result = subprocess.run([uv_path, '--version'], capture_output=True, text=True, timeout=2)
            if result.returncode == 0:
                uv_version = result.stdout.strip().replace('uv ', '')
        except Exception as e:
            uv_version = f"error: {e}"
    else:
        # Try common installation locations
        for possible_path in ['/home/vscode/.local/bin/uv', f'{sys.prefix}/bin/uv']:
            if shutil.which(possible_path):
                try:
                    result = subprocess.run([possible_path, '--version'], capture_output=True, text=True, timeout=2)
                    if result.returncode == 0:
                        uv_version = result.stdout.strip().replace('uv ', '')
                        break
                except:
                    pass
    
    # Critical packages needed for notebooks
    critical_packages = ['requests', 'bs4', 'json']
    missing = []

    for pkg in critical_packages:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)

    if missing:
        display(HTML(f"""
        <style>
            .dep-check-error {{
                border: 0px;
                background-color: transparent;
                color: inherit;
            }}
            .dep-check-error h3 {{
                margin-top: 0;
                color: #f44336;
            }}
        </style>
        <div class="dep-check-error">
            <h3>⚠️ Missing packages: {', '.join(missing)}</h3>
            <p>Run in Terminal: <code>uv sync</code>, then restart kernel.</p>
        </div>
        """))
    else:
        # All checks passed
        versions = []
        for pkg in critical_packages:
            try:
                mod = __import__(pkg)
                if hasattr(mod, '__version__'):
                    versions.append(f"{pkg}: {mod.__version__}")
            except:
                pass

        version_str = "<br>".join(
            versions) if versions else "All packages available"

        display(HTML(f"""
        <style>
            .dep-check-success {{
                border: 0px;
                background-color: transparent;
                color: inherit;
            }}
            .dep-check-success h3 {{
                margin-top: 0;
                color: #4caf50;
            }}
            .dep-check-success pre {{
                background-color: transparent;
                color: inherit;
                font-size: 12px;
            }}
        </style>
        <div class="dep-check-success">
            <h3>✅ Environment is healthy and in sync</h3>
            <pre>Python: {python_version}
UV: {uv_version}
{version_str}</pre>
        </div>
        """))
