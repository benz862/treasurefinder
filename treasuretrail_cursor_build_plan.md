# TreasureTrail / Garage Sale Map Web App — Cursor Build Plan

## Working Product Name

**TreasureTrail**

A colorful, mobile-first web app that lets a neighborhood, street, church, school, or community organizer create a beautiful online garage sale event page with participating homes, addresses, sale items, photos, categories, and an interactive map.

The goal is simple:

> Turn chaotic neighborhood garage sales into organized, shareable, searchable, map-based shopping events.

---

# 1. Core Product Concept

TreasureTrail lets one organizer create a garage sale event.

Example:

**Maplewood Neighborhood Garage Sale**  
Saturday, June 8  
8:00 AM – 3:00 PM  
15 participating homes

Each home can have:

- Address
- Seller name or nickname
- Short description
- Categories
- Featured items
- Photos
- Opening/closing times
- Optional notes like “cash only,” “early birds welcome,” “multi-family sale,” etc.

Visitors can:

- View all homes
- Search/filter by category
- See map pins
- Tap each home
- Preview items
- Open Google/Apple Maps directions
- Share the event page

---

# 2. Should This Be Built in Cursor or Lovable?

## Recommendation: Use Cursor

Use **Cursor** because this app needs:

- Real database structure
- Stripe payment logic
- Organizer accounts
- Public event pages
- Map functionality
- Image uploads
- Admin management
- Future expansion

Lovable is useful for fast mockups, but Cursor is better for building the actual production app with a clean codebase.

## Best Workflow

1. Use Cursor to build the real app.
2. Optionally use Lovable only for visual inspiration or rapid UI mockups.
3. Keep the production version in Cursor + GitHub + Vercel.

---

# 3. Do We Need a Database?

## Yes.

A database is needed because each garage sale event has dynamic content:

- Organizer account
- Event details
- Participating homes
- Addresses
- Uploaded photos
- Categories
- Payment status
- Published/unpublished state

## Recommended Database

Use **Supabase**.

Supabase should handle:

- Database tables
- Authentication
- Image storage
- Row-level security
- Organizer dashboards

---

# 4. Do We Need Login?

## Yes, but only for organizers.

There should be two types of users:

### Public Visitors

No login required.

Visitors should be able to:

- Search events
- View public event pages
- Browse homes
- Use the map
- Share links

### Organizers

Login required.

Organizers should be able to:

- Create an event
- Pay for the event
- Add homes
- Add photos
- Edit event details
- Publish/unpublish the event
- View their dashboard

---

# 5. MVP Scope

Build the first version as a simple paid event creation platform.

The MVP should include:

- Public landing page
- Organizer signup/login
- Organizer dashboard
- Create event flow
- Add/edit participating homes
- Upload photos
- Public event page
- Interactive map
- Category filtering
- Stripe Checkout
- Admin dashboard

Do not overbuild the first version.

---

# 6. Recommended Tech Stack

Use:

- **Next.js**
- **React**
- **Tailwind CSS**
- **Supabase**
- **Supabase Auth**
- **Supabase Storage**
- **Stripe Checkout**
- **Vercel**
- **Google Maps API** or **Mapbox**

Preferred map provider for MVP:

**Google Maps API**

Reason:

- Familiar to users
- Easy directions links
- Strong address recognition
- Good mobile experience

---

# 7. Pricing Model

Use simple one-time pricing.

No subscriptions for the MVP.

## Suggested Tiers

### Starter Event — $19
For small sales.

Includes:

- Up to 5 homes
- Public event page
- Interactive map
- Up to 3 photos per home

### Neighborhood Event — $39
Best default plan.

Includes:

- Up to 20 homes
- Public event page
- Interactive map
- Up to 5 photos per home
- Category filtering
- Printable flyer with QR code

### Community Event — $79
For larger events.

Includes:

- Up to 75 homes
- Public event page
- Interactive map
- Up to 8 photos per home
- Category filtering
- Printable flyer with QR code
- Featured event styling

---

# 8. Main User Flow

## Organizer Flow

1. Organizer visits landing page.
2. Clicks “Create Your Garage Sale Event.”
3. Chooses a pricing tier.
4. Pays through Stripe Checkout.
5. Creates account or logs in.
6. Creates event details:
   - Event name
   - Date
   - Start time
   - End time
   - City
   - State/province
   - Main event address
   - Description
7. Adds participating homes.
8. Uploads photos.
9. Publishes event.
10. Shares event link or QR code.

## Visitor Flow

1. Visitor lands on public event page.
2. Sees event title, date, time, and description.
3. Views interactive map.
4. Browses participating homes.
5. Filters by category.
6. Opens directions.
7. Shares event.

---

# 9. Public Pages

## Home Page

Purpose:

Explain the product and drive organizers to create an event.

Sections:

- Hero section
- Problem/solution
- Example event preview
- How it works
- Pricing
- FAQ
- Call to action

Hero copy:

**Turn Your Neighborhood Garage Sale Into a Real Event**

Create a beautiful online map, show every participating home, preview what’s for sale, and help shoppers plan their route before they arrive.

CTA buttons:

- Create Your Event
- View Sample Event

---

## Sample Event Page

Create a demo event called:

**Maplewood Community Garage Sale**

Include fake sample homes and items so users understand the concept.

---

## Public Event Page

Each event should have a public URL:

`/event/[eventSlug]`

Example:

`/event/maplewood-community-garage-sale`

Page sections:

- Event hero
- Event date/time
- Event description
- Interactive map
- Participating home cards
- Category filters
- Share button
- QR code download button

---

# 10. Dashboard Pages

## Organizer Dashboard

Route:

`/dashboard`

Shows:

- Organizer’s events
- Event status
- Tier limit
- Number of homes used
- Edit button
- Publish/unpublish button

## Create Event Page

Route:

`/dashboard/events/new`

Fields:

- Event title
- Event slug
- Event date
- Start time
- End time
- City
- State/province
- Main location/address
- Description
- Optional banner image

## Edit Event Page

Route:

`/dashboard/events/[id]/edit`

Allows organizer to edit:

- Event details
- Status
- Homes
- Images
- Categories

## Manage Homes Page

Route:

`/dashboard/events/[id]/homes`

Each home should include:

- Address
- Seller display name
- Short description
- Categories
- Featured items
- Photos
- Opening time
- Closing time
- Notes

---

# 11. Admin Dashboard

Create an admin dashboard for the platform owner.

Route:

`/admin`

Admin can:

- View all events
- View all organizers
- View payment status
- Edit/delete events
- Feature/unfeature events
- Disable inappropriate listings
- View revenue summary

Admin access should be limited to a specific email controlled by the platform owner.

Use environment variable:

`NEXT_PUBLIC_ADMIN_EMAIL`

---

# 12. Database Tables

Use Supabase.

## profiles

Stores organizer profile information.

Fields:

- id UUID primary key
- user_id UUID references auth.users
- email text
- full_name text
- role text default 'organizer'
- created_at timestamp

## events

Stores garage sale events.

Fields:

- id UUID primary key
- organizer_id UUID references profiles.id
- title text
- slug text unique
- description text
- event_date date
- start_time time
- end_time time
- city text
- region text
- country text
- main_address text
- latitude numeric nullable
- longitude numeric nullable
- status text default 'draft'
- tier text
- max_homes integer
- is_featured boolean default false
- payment_status text default 'unpaid'
- stripe_session_id text nullable
- banner_image_url text nullable
- created_at timestamp
- updated_at timestamp

## homes

Stores individual participating homes.

Fields:

- id UUID primary key
- event_id UUID references events.id
- seller_name text nullable
- address text
- latitude numeric nullable
- longitude numeric nullable
- description text
- categories text[]
- featured_items text[]
- opening_time time nullable
- closing_time time nullable
- notes text nullable
- sort_order integer default 0
- created_at timestamp
- updated_at timestamp

## home_photos

Stores uploaded photos for each participating home.

Fields:

- id UUID primary key
- home_id UUID references homes.id
- image_url text
- caption text nullable
- sort_order integer default 0
- created_at timestamp

## payments

Stores Stripe payment records.

Fields:

- id UUID primary key
- organizer_id UUID references profiles.id
- event_id UUID references events.id nullable
- stripe_session_id text
- stripe_payment_intent_id text nullable
- amount integer
- currency text default 'usd'
- tier text
- status text
- created_at timestamp

---

# 13. Supabase Storage

Create bucket:

`garage-sale-photos`

Storage rules:

- Organizers can upload photos only to their own event/home folders.
- Public can read photos for published events.
- Admin can view/delete all.

Suggested folder structure:

`events/{event_id}/homes/{home_id}/{filename}`

---

# 14. Row-Level Security

Enable RLS on all tables.

Rules:

## profiles

- Users can read/update their own profile.
- Admin can read all.

## events

- Public can read published events.
- Organizers can read/write their own events.
- Admin can read/write all.

## homes

- Public can read homes belonging to published events.
- Organizers can read/write homes belonging to their own events.
- Admin can read/write all.

## home_photos

- Public can read photos belonging to published events.
- Organizers can read/write photos belonging to their own homes/events.
- Admin can read/write all.

## payments

- Organizers can read their own payments.
- Admin can read all.
- Writes should happen through secure server/API routes only.

---

# 15. Stripe Checkout

Use Stripe Checkout for event purchases.

Create products:

1. Starter Event — $19
2. Neighborhood Event — $39
3. Community Event — $79

After payment:

- Stripe redirects to success page.
- App creates or updates event purchase record.
- Organizer can create event based on purchased tier.
- Payment status becomes `paid`.

Routes needed:

- `/pricing`
- `/checkout/success`
- `/checkout/cancel`

API routes:

- `/api/create-checkout-session`
- `/api/stripe-webhook`

Webhook should handle:

- `checkout.session.completed`

On completed payment:

- Create payment record.
- Set payment status to paid.
- Store tier.
- Unlock event creation.

---

# 16. Map Functionality

For MVP:

- Use Google Maps JavaScript API.
- Show pins for each participating home.
- Clicking a pin opens a small info card.
- Home cards should include a “Get Directions” button.

Directions link format:

`https://www.google.com/maps/search/?api=1&query={encodedAddress}`

Geocoding:

Use Google Geocoding API when organizer enters an address.

Store:

- latitude
- longitude

Fallback:

If geocoding fails, still display the address and directions link.

---

# 17. Categories

Use simple category tags.

Suggested categories:

- Furniture
- Tools
- Baby & Kids
- Clothing
- Toys
- Books
- Electronics
- Collectibles
- Antiques
- Kitchen
- Home Decor
- Sports
- Garden
- Free Items
- Multi-Family Sale
- Estate Sale

Visitors should be able to filter home cards by category.

---

# 18. Visual Style

The app should feel:

- Bright
- Friendly
- Colorful
- Local
- Trustworthy
- Mobile-first
- Slightly playful
- Easy for older organizers to use

Avoid a cold corporate SaaS look.

Use a cheerful design system.

Suggested colors:

- Warm yellow
- Deep teal
- Soft cream
- Coral accent
- Leaf green
- Charcoal text

UI style:

- Rounded cards
- Big buttons
- Clear icons
- Friendly illustrations
- Map-focused layout
- High contrast text
- Easy mobile navigation

---

# 19. Key Components

Create reusable components:

- `EventCard`
- `HomeSaleCard`
- `CategoryFilter`
- `MapView`
- `PricingCard`
- `DashboardShell`
- `PhotoUploader`
- `QRCodeGenerator`
- `ShareButton`
- `StatusBadge`
- `LimitCounter`

---

# 20. QR Code Feature

Each published event should generate a QR code.

QR code links to the public event URL.

Organizer can:

- Download QR code as PNG
- Use it on yard signs
- Use it on flyers
- Share on Facebook

Use a QR code library such as:

`qrcode.react`

---

# 21. Printable Flyer Feature

For Neighborhood and Community tiers, generate a simple printable flyer.

Flyer should include:

- Event title
- Date
- Time
- City/neighborhood
- Short description
- QR code
- Public event URL
- “Scan to see the full garage sale map”

MVP can use browser print styling.

---

# 22. SEO

Each public event page should include:

- Event title
- City
- Date
- Description
- Open Graph image
- SEO title
- SEO description

Example SEO title:

`Maplewood Community Garage Sale | June 8 | TreasureTrail`

Example SEO description:

`Browse participating homes, preview items, and view the interactive map for the Maplewood Community Garage Sale.`

---

# 23. MVP Build Order for Cursor

Build in this order:

## Phase 1 — Foundation

- Create Next.js app
- Install Tailwind
- Set up app layout
- Create landing page
- Create pricing page
- Create sample event page with static data

## Phase 2 — Supabase

- Connect Supabase
- Add environment variables
- Create database tables
- Add authentication
- Create profiles on signup
- Add protected dashboard routes

## Phase 3 — Event Management

- Build organizer dashboard
- Create event form
- Edit event form
- Create homes management UI
- Add category tags
- Add publish/unpublish toggle

## Phase 4 — Public Event Pages

- Build dynamic public event pages
- Show event details
- Show participating homes
- Add category filtering
- Add share button

## Phase 5 — Maps

- Add Google Maps
- Add geocoding
- Store lat/lng
- Show pins
- Add directions buttons

## Phase 6 — Photos

- Add Supabase Storage
- Upload home photos
- Display photo galleries
- Add basic delete/reorder functionality

## Phase 7 — Stripe

- Create checkout session
- Add success/cancel pages
- Add webhook
- Unlock event creation by paid tier
- Add home count limits based on tier

## Phase 8 — Admin

- Add admin route
- Restrict by admin email
- View all events
- View all users
- View payments
- Feature/unfeature events

## Phase 9 — Polish

- Add QR code generator
- Add printable flyer
- Improve mobile UI
- Add empty states
- Add loading states
- Add error handling
- Add SEO metadata

---

# 24. Environment Variables

Use these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SITE_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

NEXT_PUBLIC_ADMIN_EMAIL=
```

---

# 25. Important Build Rules

Cursor should follow these rules:

1. Build the app as a real production-ready MVP.
2. Do not use placeholder-only pages.
3. Every page must have working layout and useful content.
4. Public visitors should not need to log in.
5. Organizers must log in to create and manage events.
6. Stripe must control paid access.
7. Supabase should be the source of truth.
8. The dashboard must enforce tier limits.
9. The UI must be mobile-first.
10. Keep the code clean, organized, and easy to expand.
11. Use clear file names and readable components.
12. Do not hard-code private keys.
13. Use environment variables.
14. Include useful empty states.
15. Include basic validation on all forms.

---

# 26. Suggested File Structure

```txt
/app
  /admin
    page.tsx
  /api
    /create-checkout-session
      route.ts
    /stripe-webhook
      route.ts
  /auth
    /login
      page.tsx
    /signup
      page.tsx
  /checkout
    /success
      page.tsx
    /cancel
      page.tsx
  /dashboard
    page.tsx
    /events
      /new
        page.tsx
      /[id]
        /edit
          page.tsx
        /homes
          page.tsx
  /event
    /[slug]
      page.tsx
  /pricing
    page.tsx
  page.tsx
/components
  EventCard.tsx
  HomeSaleCard.tsx
  CategoryFilter.tsx
  MapView.tsx
  PricingCard.tsx
  DashboardShell.tsx
  PhotoUploader.tsx
  QRCodeGenerator.tsx
  ShareButton.tsx
  StatusBadge.tsx
  LimitCounter.tsx
/lib
  supabaseClient.ts
  supabaseAdmin.ts
  stripe.ts
  maps.ts
  utils.ts
/types
  database.ts
```

---

# 27. Cursor Prompt

Use this prompt in Cursor:

```txt
Build a production-ready MVP for a web app called TreasureTrail.

TreasureTrail lets organizers create paid, public, interactive garage sale event pages for neighborhood, community, church, school, or town-wide garage sales.

The app should use Next.js, React, Tailwind CSS, Supabase, Supabase Auth, Supabase Storage, Stripe Checkout, and Google Maps.

Public visitors do not need an account. Organizers need an account to create and manage events. Admin access should be restricted by NEXT_PUBLIC_ADMIN_EMAIL.

The app must include:

1. Public landing page
2. Pricing page
3. Sample event page
4. Organizer signup/login
5. Organizer dashboard
6. Create/edit event flow
7. Add/edit/delete participating homes
8. Upload photos for each home
9. Public event pages at /event/[slug]
10. Interactive Google Map with pins
11. Category filters
12. Stripe Checkout for paid event tiers
13. Stripe webhook for completed checkout
14. Tier-based home limits
15. QR code download for public event page
16. Printable flyer page/print style
17. Admin dashboard

Use Supabase tables:

- profiles
- events
- homes
- home_photos
- payments

Use the database schema described in this document.

Pricing tiers:

- Starter Event: $19, up to 5 homes
- Neighborhood Event: $39, up to 20 homes
- Community Event: $79, up to 75 homes

Design style:

Bright, friendly, colorful, mobile-first, trustworthy, local, cheerful, and easy for older organizers to use. Avoid a cold corporate SaaS look.

Build everything with clean reusable components and clear routes. Include form validation, loading states, empty states, and error messages. Use environment variables for all keys.
```

---

# 28. Future Features After MVP

Do not build these first, but keep the structure ready for them:

- Shopper accounts
- Save favorite homes
- Route planning
- SMS reminders
- Email reminders
- Marketplace-style item search
- Local business sponsorships
- Featured city pages
- Annual recurring events
- Organizer invite links for homeowners
- Homeowner self-submit form
- Approval queue
- AI-generated sale descriptions
- Printed yard sign ordering
- Paid featured placement

---

# 29. Best First Version

The best first version is not a huge marketplace.

The best first version is:

> A paid event page generator for neighborhood garage sale organizers.

Start there.

Once real organizers use it, then expand into a searchable public garage sale marketplace.
