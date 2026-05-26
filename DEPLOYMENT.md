# Deployment

This document is the canonical reference for how `RENT-DMC` deploys to Cloudflare Pages via GitHub Actions. If you see a workflow failure like `Input required and not supplied: apiToken`, start here.

---

## Where the secrets live

| Location | URL |
|---|---|
| **Org secrets** (primary) | https://github.com/organizations/BelichickGillisMusk/settings/secrets/actions |
| **Repo secrets** (fallback) | https://github.com/BelichickGillisMusk/RENT-DMC/settings/secrets/actions |
| **Repo Actions variables** | https://github.com/BelichickGillisMusk/RENT-DMC/settings/variables/actions |

> **Important:** This repo is **public** and is a **fork**. GitHub's "Private repositories" preset for org secrets will **not** grant access to public or forked repos. You must choose either **All repositories** or **Selected repositories** and explicitly list `RENT-DMC`.

---

## Required secrets

| Secret name | Scope | Used by | How to obtain |
|---|---|---|---|
| `CLOUDFLARE_TOKEN` | Org | `.github/workflows/deploy.yml` | Cloudflare dashboard → My Profile → API Tokens → Create Token → use the **"Edit Cloudflare Pages"** template |
| `CLOUDFLARE_ACCOUNT_ID` | Org (**needs to be created**) | `.github/workflows/deploy.yml` | Cloudflare dashboard right sidebar on any Pages/domain page, or read it from the URL: `dash.cloudflare.com/<ACCOUNT_ID>/...` |
| `GEMINI_API_KEY` | Org or Repo (optional) | Build step | https://aistudio.google.com/app/apikey — app runs without it, but AI features degrade gracefully |

---

## Known issues / cleanup

- **`CLOUDFARE_TOKEN`** (missing the "L" in CLOUDFLARE) exists as an org secret and should be **deleted** — it is a typo and is unused by any workflow. Leaving it around causes confusion.

---

## How to add a new secret

1. Go to the org secrets page: https://github.com/organizations/BelichickGillisMusk/settings/secrets/actions
2. Click **New organization secret**.
3. Enter the secret **Name** and **Value**.
4. Under **Repository access**, select **All repositories** (or **Selected repositories** → add `RENT-DMC`).
5. Click **Add secret**.
6. Reference it in workflows as `${{ secrets.NAME }}`.

---

## Troubleshooting: `Input required and not supplied`

This error means the `${{ secrets.X }}` expression resolved to an empty string by the time the action validated its inputs. Common causes:

| Cause | How to diagnose | Fix |
|---|---|---|
| **Secret name typo** | Compare the name in the workflow vs. the org/repo secrets page exactly (case-sensitive) | Rename the secret or update the workflow reference |
| **Secret not granted to this repo** | Open the org secret and check its "Repository access" setting | Change to "All repositories" or add `RENT-DMC` under "Selected repositories" |
| **PR from a fork** | Check `github.event.pull_request.head.repo.full_name` — forks don't receive secrets | The `if:` guard in the deploy step skips the step for fork PRs; this is expected behaviour |
| **Wrong scope** | Env secrets are only available to jobs that declare `environment:` | Move the secret to org or repo scope, or add the environment declaration to the job |

The preflight step in `.github/workflows/deploy.yml` will print a specific `::error::` annotation for each missing secret before the deploy step runs, making it easier to pinpoint the cause.

---

## Deploy flow summary

`.github/workflows/deploy.yml` runs on every `push` to `main` and on every `pull_request` targeting `main`. It checks out the code, installs Node 20 dependencies via `npm ci`, and builds the Vite app (`npm run build`), passing in the optional `GEMINI_API_KEY` for AI features. Before deploying, a preflight step verifies that both Cloudflare secrets are accessible; if either is missing it exits with a descriptive error and a link to this document. The actual deploy uses `cloudflare/pages-action@v1` to publish the `dist/` folder to the `rent-ruby` Cloudflare Pages project. The deploy step (and the preflight step) are guarded with an `if:` condition so they are skipped for pull requests originating from forks, where GitHub does not expose org or repo secrets.
