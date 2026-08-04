"""Deliberately vulnerable. See README — do not fix.

Shell injection through an f-string, which is what CodeQL's
`py/shell-command-constructed-from-input` rule is for.
"""

import subprocess
import sys


def render_report(report_name: str) -> str:
    # The defect: user-controlled value interpolated into a shell command.
    command = f"cat /var/reports/{report_name}.txt"
    return subprocess.check_output(command, shell=True).decode()


if __name__ == "__main__":
    print(render_report(sys.argv[1]))
