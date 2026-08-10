# seo.aktechstudio.com — SEO Rank Tracking & Analytics Platform

A full-stack, serverless SEO analytics platform built for **seo.aktechstudio.com**. This platform allows users to connect their Google Search Console properties via Google OAuth 2.0 and view real search query rankings, average positions, clicks, impressions, CTR, sitemap status, and mobile usability metrics — powered completely by free Google APIs with zero third-party API costs.

---

## Tech Stack & Architecture

- **Frontend Hosting:** Cloudflare Pages (React 18 + TypeScript + Vite + TailwindCSS + Recharts + Lucide Icons)
- **Backend/API:** Cloudflare Workers / Pages Functions
- **Database:** Cloudflare D1 (SQLite serverless database)
- **Scheduled Refresh:** Cloudflare Workers Cron Triggers (`0 3 * * *` daily refresh)
- **Auth & Data Source:** Google OAuth 2.0 + Google Search Console API (`webmasters.readonly` scope)

---

## Key Features

### 1. Google OAuth 2.0 Authentication & Verification Gate
- Single login flow handles both user identity AND Google Search Console API scope authorization.
- GSC Ownership Verification Gate: Users can only connect websites they have **verified ownership** of in Google Search Console.

### 2. Connected Site Rank Tracking Dashboard
- Overview Cards: Total Clicks, Total Impressions, Avg CTR %, Avg Rank Position.
- Interactive Recharts position & click trend graphs over time.
- Search Queries Data Table with search filter, column sorting, and position numbers.
- Landing Pages performance breakdown table.
- Indexing & Sitemap status audit tab (from GSC API).
- Mobile Usability status audit tab.

### 3. Server-Side Free vs. Premium Tier Enforcement
- **Free Tier**:
  - Max 1 connected website
  - Top 10 tracked queries visible
  - 28-day data history limit
  - 3 daily standalone tool uses
- **Premium Tier**:
  - Unlimited connected websites
  - Full search keyword rankings (up to 500+)
  - Full 16-month historical analytics
  - Unlimited standalone tool uses
  - Exportable PDF / CSV report stub
- **Payment Gateway Integration Point**:
  - Cleanly stubbed via `/api/upgrade` endpoint for dropping in Stripe or Razorpay API keys.

### 4. Standalone SEO Utilities Suite
1. **SERP & Meta Snippet Previewer**: Simulates Google search snippet appearance and OpenGraph social cards.
2. **Keyword Density & Frequency Analyzer**: Analyzes content word count, unique words, and keyword density percentages.
3. **Sitemap.xml Validator**: Live fetcher and XML structure validator for sitemap files.

### 5. Server-Side Gated Admin Console (`/admin`)
- Strictly restricted server-side in Workers to **`ashishkushwaha88643@gmail.com`**. Returns HTTP 403 Forbidden to all other accounts.
- View system signups, active sites, free vs premium user list, and daily GSC API quota usage.
- Manually upgrade/downgrade user plans.
- Global switches to toggle premium gating on standalone tools.

---

## Environment Variables Configuration

Create a `.env` file locally or set these secrets in **Cloudflare Pages Dashboard → Settings → Environment variables**:

```env
# Google OAuth 2.0 Credentials (From Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Authorized OAuth Redirect URI
REDIRECT_URI=https://seo.aktechstudio.com/api/auth/callback

# Admin & Session Secrets
JWT_SECRET=super_secret_aktech_seo_jwt_key_2026_x99!
ADMIN_EMAIL=ashishkushwaha88643@gmail.com
```

---

## Google Cloud Console OAuth Setup Guide

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g. `AK-Tech-SEO-Platform`).
3. Enable the **Google Search Console API** under **APIs & Services → Library**.
4. Configure the **OAuth Consent Screen**:
   - User Type: External
   - App Name: `seo.aktechstudio.com`
   - User support email: `ashishkushwaha88643@gmail.com`
   - Scopes to add:
     - `openid`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/webmasters.readonly`
5. Create **OAuth 2.0 Client ID** credentials (Web Application):
   - Authorized JavaScript origins: `http://localhost:5173`, `https://seo.aktechstudio.com`
   - Authorized redirect URIs: `http://localhost:5173/api/auth/callback`, `https://seo.aktechstudio.com/api/auth/callback`

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local SQLite D1 database migration
npm run d1:init

# 3. Start Vite dev server
npm run dev

# 4. Build for production
npm run build
```

---

## Cloudflare D1 & Pages Deployment Steps

1. Create a Cloudflare D1 Database in Cloudflare Dashboard:
   ```bash
   npx wrangler d1 create seo-db
   ```
2. Execute the database migration schema on Cloudflare D1:
   ```bash
   npx wrangler d1 execute seo-db --remote --file=./schema.sql
   ```
3. Connect your GitHub repository (`https://github.com/ashishkushwahatopstech/Queryroost.git`) to Cloudflare Pages:
   - Build Command: `npm run build`
   - Build Output Directory: `dist`
   - Bind D1 Database `DB` to database `seo-db`
4. Add custom domain `seo.aktechstudio.com` in Cloudflare Pages custom domains tab.

---

## Git Repository Setup

```bash
git init
git remote add origin https://github.com/ashishkushwahatopstech/Queryroost.git
git add .
git commit -m "feat: complete seo.aktechstudio.com SEO rank tracker platform"
git branch -M main
git push -u origin main
```
