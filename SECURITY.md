# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability:

1.  **Do NOT** open a public issue.
2.  Please email the maintainer directly at: **aasavchauhan@gmail.com**
3.  Include "Security Vulnerability" in the subject line.
4.  Provide details on how to reproduce the issue.

We will acknowledge your report within 48 hours and work with you to fix it.

## Secret Management

- Never commit live credentials, API keys, or `.env` files.
- Keep local secrets only in untracked files (for example, `.env` copied from `.env.example`).

If a secret is exposed:

1. Rotate/revoke the secret immediately at the provider.
2. Replace any affected credentials in all environments.
3. Remove the secret from repository history (using `git filter-repo` or BFG) and force-push cleaned history.
4. Invalidate active sessions/tokens and audit recent access.
5. Enable and review GitHub secret scanning alerts for confirmation.

> ⚠️ History rewriting requires coordination with all contributors and can require team members to re-clone or hard-reset local repositories.
> ⚠️ For public repositories, treat exposed secrets as permanently compromised even after deletion, because mirrors/caches may retain them.

References:
- git-filter-repo: https://github.com/newren/git-filter-repo
- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
