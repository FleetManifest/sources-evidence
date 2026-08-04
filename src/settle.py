"""More deliberate defects, added to provoke NEW code-scanning alerts.

An existing alert does not re-fire `code_scanning_alert.created`, so verifying the
adapter against a live delivery needs code the scanners have not seen before.
"""

import pickle
import subprocess


def load_ledger(blob: bytes):
    # Deliberate: untrusted deserialisation (CodeQL `py/unsafe-deserialization`).
    return pickle.loads(blob)


def archive_ledger(ledger_name: str) -> None:
    # Deliberate: shell injection through an f-string.
    subprocess.call(f"tar czf /tmp/{ledger_name}.tgz /var/ledgers/{ledger_name}", shell=True)

