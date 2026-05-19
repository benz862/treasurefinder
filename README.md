# Treasure Finder

Turn neighborhood garage sales into organized, shareable, map-based shopping events.

**Website:** [treasurefinder.app](https://treasurefinder.app)  
**Repository:** [github.com/benz862/treasurefinder](https://github.com/benz862/treasurefinder)

## Stack

- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Stripe Checkout
- Google Maps

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Run the database migration in `supabase/migrations/001_initial_schema.sql` against your Supabase project.

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app locally.

## Deploy

Deploy to Vercel and connect the [treasurefinder](https://github.com/benz862/treasurefinder) repository. Set environment variables from `.env.example`, with:

```env
NEXT_PUBLIC_SITE_URL=https://treasurefinder.app
```

## License

Private — all rights reserved.
