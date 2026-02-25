# Deployment Guide (Vercel)

This project has been aggressively optimized for a serverless environment using **Next.js 15 App Router** and **Vercel**.

## Prerequisites
1. A GitHub/GitLab/Bitbucket repository containing this codebase.
2. A free [Vercel](https://vercel.com/) account.
3. A Vercel Postgres or Supabase Database URL.
4. Razorpay API Keys (Test or Live).

## Step 1: Initialize Database
Before deploying to Vercel, you need a live PostgreSQL database. The easiest method is adding **Vercel Postgres** to your project in the Vercel dashboard.

Copy the connection strings provided by Vercel and add them to your local `.env`:
```env
DATABASE_URL="postgres://default:xyz@ep-restless-bird-1234.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

Push the database schema and seed the products:
```bash
npx prisma db push
npm run seed
```

## Step 2: Deploy to Vercel
1. Log in to Vercel and click **Add New Project**.
2. Import the Git repository containing this project.
3. Vercel will auto-detect the Next.js framework.
4. In the **Environment Variables** section, add the following identical keys:
   - `DATABASE_URL` 
   - `RAZORPAY_KEY_ID` (Your `rzp_test_...` or live key)
   - `RAZORPAY_KEY_SECRET`

**Important Note for Prisma:** 
Because we generate the Prisma client during the build, Vercel will automatically run `npm install` and then `npm run build` (which includes `npx prisma generate` assuming it's hooked in package.json or implicitly run by Vercel).

5. Click **Deploy**.

## Performance Optimizations Applied
- **Next/Image with Unsplash:** `next.config.ts` handles remote patterns. Edge caching keeps Time to First Byte (TTFB) low.
- **SSR/ISR Strategies:** The `<Navbar>` and `<CartDrawer>` are structurally optimized for client-side hydrating, while heavy lifting like Product Fetching is done via Server Actions avoiding thick client bundles.
- **Framer Motion Elements:** Animations use hardware acceleration (transform and opacity) preventing layout shifts (CLS issues).

## Step 3: Verify the Live Build
Once Vercel gives you a domain (e.g. `your-store-123.vercel.app`):
- Run a Lighthouse report (Targeting 95+ Score).
- Perform a mock checkout to ensure Razorpay creates the orders dynamically and securely.
