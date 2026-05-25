<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/85f4144f-dabc-4ffc-b990-b6a65dc46dad

## Deployment

This project deploys to Cloudflare Pages via GitHub Actions. See [DEPLOYMENT.md](./DEPLOYMENT.md) for:

- Where the org/repo secrets live (with direct links)
- Required secret names and how to obtain them
- Troubleshooting `Input required and not supplied` errors

Org secrets page: https://github.com/organizations/BelichickGillisMusk/settings/secrets/actions

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
