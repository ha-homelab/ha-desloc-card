"""The release adapter preserves HACS compatibility and binds the real payload."""

import hashlib
import json
from pathlib import Path
import tempfile
import unittest

import package_card


class CardPackageTests(unittest.TestCase):
    def test_changes_only_version_and_records_exact_payload(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = '/* license */\nconst VERSION = "0.1.2";\nexport const sentinel = 1;\n'
            (root / package_card.ENTRY).write_text(source)
            (root / "package.json").write_text('{"version":"0.1.3-rc.1"}')
            (root / "private.txt").write_text("PRIVATE_SENTINEL")
            entry = package_card.package(root, root / "dist", "a" * 40)
            self.assertEqual(entry.name, "ha-desloc-card.js")
            self.assertEqual(entry.read_text(), source.replace('"0.1.2"', '"0.1.3-rc.1"'))
            metadata = json.loads((entry.parent / "ha-desloc-card.version.json").read_text())
            self.assertEqual(metadata["version"], "0.1.3-rc.1")
            self.assertEqual(metadata["source_sha"], "a" * 40)
            self.assertEqual(metadata["sha256"], hashlib.sha256(entry.read_bytes()).hexdigest())
            self.assertEqual(sorted(p.name for p in entry.parent.iterdir()),
                             ["SHA256SUMS", "ha-desloc-card.js", "ha-desloc-card.version.json"])
            self.assertIn(f'{metadata["sha256"]}  ha-desloc-card.js\n',
                          (entry.parent / "SHA256SUMS").read_text())
            with self.assertRaises(FileExistsError):
                package_card.package(root, root / "dist", "a" * 40)

    def test_missing_or_ambiguous_version_fails_before_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "package.json").write_text('{"version":"0.1.3"}')
            for source in ('export const x = 1;\n', 'const VERSION = "1";\nconst VERSION = "2";\n'):
                (root / package_card.ENTRY).write_text(source)
                with self.assertRaises(ValueError):
                    package_card.package(root, root / "dist", "a" * 40)
                self.assertFalse((root / "dist").exists())


if __name__ == "__main__":
    unittest.main()
