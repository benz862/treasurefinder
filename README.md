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

## Deploy

Deploy to Vercel and connect the [treasurefinder](https://github.com/benz862/treasurefinder) repository. Set environment variables from `.env.example`, with:

```env
NEXT_PUBLIC_SITE_URL=https://treasurefinder.app
NEXT_PUBLIC_SUPABASE_URL=https://tbbywzbmzxlzufyidvjm.supabase.co
```

Add the same Supabase keys in Vercel project settings.

## License

Private — all rights reserved.
