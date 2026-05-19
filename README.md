# Treasure Finder

Turn neighborhood garage sales into organized, shareable, map-based shopping events.

**Website:** [treasurefinder.app](https://treasurefinder.app)  
**Repository:** [github.com/benz862/treasurefinder](https://github.com/benz862/treasurefinder)  
**Supabase:** [tbbywzbmzxlzufyidvjm.supabase.co](https://tbbywzbmzxlzufyidvjm.supabase.co)

## Stack

- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Stripe Checkout
- Google Maps

## Supabase (GitHub linked)

Database migrations live in `supabase/migrations/` and deploy automatically when changes merge to `main` on GitHub.

Project ID: `tbbywzbmzxlzufyidvjm`

### Auth redirect URLs

In Supabase → Authentication → URL Configuration, confirm:

- Site URL: `https://treasurefinder.app`
- Redirect URLs:
  - `https://treasurefinder.app/auth/callback`
  - `http://localhost:3000/auth/callback`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. In Supabase → Project Settings → API, copy your keys into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tbbywzbmzxlzufyidvjm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app locally.

## Deploy (Vercel)

Production is deployed from the [treasurefinder](https://github.com/benz862/treasurefinder) repository.

Set these environment variables in **Vercel → Project → Settings → Environment Variables** (Production):

```env
NEXT_PUBLIC_SITE_URL=https://treasurefinder.app

NEXT_PUBLIC_SUPABASE_URL=https://tbbywzbmzxlzufyidvjm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

NEXT_PUBLIC_ADMIN_EMAIL=
```

### Stripe webhook

In Stripe → Developers → Webhooks, point the endpoint to:

`https://treasurefinder.app/api/stripe-webhook`

Enable this event only:

- `checkout.session.completed`

Paste the webhook signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.

### Google Maps

Enable these APIs in Google Cloud:

- Maps JavaScript API
- Geocoding API

Use one API key for `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### Local development

Copy `.env.example` to `.env.local` and use the same keys as production (or Stripe/Supabase test keys).

## License

Private — all rights reserved.
