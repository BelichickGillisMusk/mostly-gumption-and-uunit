# Deploy Rent-Ruby to Cloudflare Pages

## One-time Cloudflare setup

1. **Add the domain** in [Cloudflare Dashboard](https://dash.cloudflare.com) → **Add a site** → `rent-ruby.com` (update nameservers at your registrar if prompted).

2. **Create a Pages project** → **Create application** → **Connect to Git** → select this repo.
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Project name: `rent-ruby`

3. **GitHub secrets** (repo → Settings → Secrets → Actions):
   - `CLOUDFLARE_API_TOKEN` — token with **Cloudflare Pages: Edit** and **Account: Read**
   - `CLOUDFLARE_ACCOUNT_ID` — `bafa242dd95d3fdce72540d20accd0a2` (Silverbackai Agency)

4. **Custom domain** — Pages project → **Custom domains** → add `rent-ruby.com` and `www.rent-ruby.com`.

## Manual deploy (CLI)

```bash
npm ci
npm run build
CLOUDFLARE_API_TOKEN="…" CLOUDFLARE_ACCOUNT_ID="bafa242dd95d3fdce72540d20accd0a2" \
  npx wrangler pages deploy dist --project-name=rent-ruby
```

Pushes to `main` also deploy via `.github/workflows/deploy-cloudflare-pages.yml` when secrets are configured.
