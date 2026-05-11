# PantryPal

PantryPal is a Node/Express recipe and pantry-planning website with:

- PantryPal account login and signup
- Google sign-in via Firebase
- password reset flow
- Stripe subscription checkout
- guest mode and member recommendations
- recipe search and recipe detail views
- profile, favorites, shopping lists, and saved ingredients

## Tech stack

- Node.js
- Express
- Vanilla HTML, CSS, JavaScript
- Supabase
- Firebase Authentication
- Stripe Checkout

## Local development

1. Open PowerShell in this project folder.
2. Install dependencies:

```powershell
npm install
```

3. Create a `.env.local` file using `.env.example`.
4. Start the server:

```powershell
npm start
```

5. Open:

```text
http://127.0.0.1:8080
```

6. Health check:

```text
http://127.0.0.1:8080/api/health
```

## Render deployment

This repo includes a `render.yaml` file for a Node web service.

### Build and start

- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`

### Required Render environment variables

Set these in the Render dashboard:

- `APP_ENV`
- `PUBLIC_APP_URL`
- `HOST`
- `PORT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_USERS_TABLE`
- `SUPABASE_DELETIONS_TABLE`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MESSAGING_SENDER_ID`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEEKLY_PRICE_ID`
- `STRIPE_30DAY_PRICE_ID`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

## Notes

- Do not commit `.env.local`.
- Do not commit `node_modules`.
- Configure Firebase authorized domains for both local and hosted URLs.
- Configure Stripe in test mode first, then move to live mode when ready.
