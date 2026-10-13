#!/usr/bin/env python3
"""Package the existing HACS entry point with a frozen, auditable version."""

import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ENTRY = "ha-desloc-card.js"


def package(root: Path, output: Path, source_sha: str) -> Path:
    """Stamp only the version declaration; never bundle local or private files."""
    if re.fullmatch(r"[a-f0-9]{40}", source_sha) is None:
        raise ValueError("Expected an exact source commit")
    version = json.loads((root / "package.json").read_text())["version"]
    if re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?", version) is None:
        raise ValueError("Invalid prepared card version")
    source = (root / ENTRY).read_text()
    stamped, count = re.subn(
        r'^const VERSION = "[^"\n]+";$',
        f'const VERSION = "{version}";',
        source,
        flags=re.MULTILINE,
    )
    if count != 1:
        raise ValueError("Expected exactly one card version declaration")
    payload = stamped.encode()
    metadata = {
        "schema": 1,
        "version": version,
        "source_sha": source_sha,
        "entry": ENTRY,
        "sha256": hashlib.sha256(payload).hexdigest(),
        "scope": "Home Assistant frontend card; no device acceptance claim",
    }
    output.mkdir(parents=True, exist_ok=False)
    entry = output / ENTRY
    entry.write_bytes(payload)
    (output / "ha-desloc-card.version.json").write_text(json.dumps(metadata, indent=2) + "\n")
    checksums = "".join(
        f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n"
        for path in sorted(output.iterdir())
    )
    (output / "SHA256SUMS").write_text(checksums)
    return entry


if __name__ == "__main__":
    sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    print(package(ROOT, ROOT / "release-dist", sha))
