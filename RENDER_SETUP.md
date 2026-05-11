# PantryPal Render Deployment

## Local development

1. Open PowerShell in `C:\Users\ranja\OneDrive\Documents\New project`
2. Run `npm start`
3. Keep that terminal open
4. Open [http://127.0.0.1:8080](http://127.0.0.1:8080)
5. Check [http://127.0.0.1:8080/api/health](http://127.0.0.1:8080/api/health) if you want a quick server health check

Localhost is now treated as a development environment:

- PantryPal username/password login still works
- Google sign-in uses a safe local fallback screen
- Real Firebase password reset is intentionally disabled on localhost
- Real Stripe checkout is intentionally disabled on localhost

## Render deployment

Create a new Render Web Service pointing to this project and use:

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

## Render environment variables

Set these in the Render dashboard, not in code:

- `APP_ENV=production`
- `PUBLIC_APP_URL=https://your-render-url.onrender.com`
- `HOST=0.0.0.0`
- `PORT=10000` or leave Render default
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_USERS_TABLE`
- `SUPABASE_DELETIONS_TABLE=account_deletions`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MESSAGING_SENDER_ID`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEEKLY_PRICE_ID`
- `STRIPE_30DAY_PRICE_ID`
- optional SMTP values if subscription emails are needed

## Firebase checklist

In Firebase Console:

- enable Google sign-in
- enable Email/Password
- add the Render hostname to Authorized Domains

## Stripe checklist

In Stripe:

- keep Checkout in test mode until you are ready for live payments
- make sure weekly and monthly price IDs match the values in Render env vars
- test from the hosted Render URL, not localhost
