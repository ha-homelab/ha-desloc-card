"""Protect the distinction between source audits, beta and RC qualification."""
import json
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]


class BrowserWorkflowTests(unittest.TestCase):
    def test_release_channel_reaches_the_shared_verdict(self):
        workflow = yaml.safe_load((ROOT / '.github/workflows/ci.yml').read_text())
        job = workflow['jobs']['browser-compatibility']
        self.assertNotIn('continue-on-error', job)
        self.assertEqual(job['with']['browser-release-channel'],
                         "${{ github.event_name == 'workflow_dispatch' && github.event.inputs.channel || '' }}")
        self.assertEqual(job['with']['browser-extended'],
                         "${{ github.event_name == 'schedule' || (github.event_name == 'workflow_dispatch' && (github.event.inputs.channel == '' || github.event.inputs.channel == 'rc' || github.event.inputs.channel == 'stable')) }}")
        self.assertEqual(job['with']['browser-test-command'], 'node scripts/browser-acceptance.cjs')

    def test_stable_promotes_bytes_from_rc_and_keeps_the_35_target_inventory(self):
        policy = json.loads((ROOT / '.release-policy.json').read_text())
        self.assertEqual(policy['versioning']['promotion'], 'promote-bytes')
        rows = json.loads((ROOT / '.github/browser-compatibility.json').read_text())
        self.assertEqual(len(rows), 35)
        self.assertEqual(len({row['id'] for row in rows}), 35)
        self.assertEqual(sum(row['tier'] == 'required' for row in rows), 5)


if __name__ == '__main__':
    unittest.main()
