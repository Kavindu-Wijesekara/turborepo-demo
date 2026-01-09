# GitHub Actions & Vercel Setup Guide

## 📋 Prerequisites: Manual First Deployment

**IMPORTANT**: You must deploy your apps to Vercel manually at least once before setting up GitHub Actions.

### Step 1: Deploy apps to Vercel manually

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy admin app
cd apps/admin
vercel --prod

# Deploy client app
cd apps/client
vercel --prod
```

This creates your Vercel projects and gives you the project IDs needed.

---

## 🔐 GitHub Actions Secrets Setup

In your GitHub repo: **Settings → Secrets and variables → Actions**

Add these secrets:

```
VERCEL_TOKEN              → Get from https://vercel.com/account/tokens
VERCEL_ORG_ID             → Your Vercel org ID (from vercel whoami)
VERCEL_ADMIN_PROJECT_ID   → Project ID from admin app (in vercel.json after deployment)
VERCEL_CLIENT_PROJECT_ID  → Project ID from client app (in vercel.json after deployment)
```

To find project IDs after manual deployment:

```bash
cd apps/admin && cat .vercel/project.json | grep projectId
cd apps/client && cat .vercel/project.json | grep projectId
```

Or check in Vercel dashboard: Project settings → General → Project ID

---

## ⚙️ Workflow Trigger Rules

### **CI Workflow** (`.github/workflows/ci.yml`)

✅ Runs on EVERY PR and push to main/develop

- Linting
- Format checking
- Type checking
- Full builds
- **NO deployments** ✅ Safe to run on all commits

### **Deploy Workflow** (`.github/workflows/deploy.yml`)

🔒 Runs ONLY on push to `main` branch

- Production deployment to Vercel
- Deploys both admin and client apps
- **Only triggers on merges to main**

### **Preview Workflow** (`.github/workflows/preview.yml`)

🔒 Runs ONLY on PRs

- Creates preview deployments
- Vercel auto-comments with URLs
- **No production deployment**

---

## 🚀 Deployment Flow

```
commit to feature → push to GitHub
                  ↓
            CI workflow runs (linting, tests, builds)
                  ↓
            Submit PR
                  ↓
      Preview workflow runs (preview on Vercel)
                  ↓
            Merge to main
                  ↓
        Deploy workflow runs (production deploy)
```

---

## ✅ Verification

After setting up:

1. Push a test commit to your main branch
2. Watch Actions tab → Deploy workflow should run
3. Check Vercel dashboard for deployment
4. Verify apps are live

---

## Getting these values:

1. **VERCEL_TOKEN**: Go to https://vercel.com/account/tokens and create a new token
2. **VERCEL_ORG_ID**: Run `vercel whoami` locally or check dashboard
3. **Project IDs**: After deploying apps to Vercel, find them in:
   - `.vercel/project.json` in each app directory
   - Or Vercel dashboard → Project settings → General → Project ID

## Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every PR and push to main/develop:

- Linting
- Format checking
- Type checking
- Full monorepo build
- Individual app builds (admin, client)

### Deployment Workflow (`.github/workflows/deploy.yml`)

Runs on merge to main:

- Deploys admin app to Vercel
- Deploys client app to Vercel

### Preview Workflow (`.github/workflows/preview.yml`)

Runs on every PR:

- Creates preview deployments for both apps
- Vercel automatically comments with preview URLs

## Local Testing

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run CI workflow
act pull_request

# Run deploy workflow
act push -b main
```

## Environment Variables

For Vercel deployments, set environment variables per app in the respective `next.config.ts` or `.env.production.local` files, or configure them directly in Vercel dashboard.
