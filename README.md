# sources-evidence

A **deliberately defective** repository. Every file here contains bugs on purpose.

It exists so FleetManifest's source adapters (P2.2) can be verified against real
deliveries from real tools rather than against fixtures we wrote ourselves —
`packages/api/CLAUDE.md` records why that distinction matters: a receiver hashing
`JSON.stringify(request.body)` "passes every test written from an object literal and
fails against GitHub".

**Nothing here is real.** The identifiers are invented, the credential is fake, and
none of this code is deployed or imported anywhere. Do not fix the bugs — they are
the fixtures.

## What runs against it

| Tool | How | Produces |
|---|---|---|
| CodeQL | GitHub default setup | `code_scanning_alert` |
| Trivy | `.github/workflows/trivy.yml` → `upload-sarif` | `code_scanning_alert`, a *second* `tool.name` |
| Gitleaks | same workflow | `code_scanning_alert` |
| CodeRabbit | GitHub App, free OSS plan | `pull_request_review_comment` / `issue_comment` |
| GitHub Actions | `.github/workflows/checks.yml` | `check_run`, `workflow_run` |

Two *distinct* `tool.name` values is not incidental — it is what PRD §8.1's
"one adapter, many tools" claim is verified by.
