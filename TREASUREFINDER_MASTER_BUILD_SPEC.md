# TREASUREFINDER MASTER BUILD SPEC
# Cursor Implementation Document
# Version 1.0

---

# PROJECT OVERVIEW

TreasureFinder is a modern, mobile-first web platform for discovering and organizing:

- Garage sales
- Yard sales
- Estate sales
- Community sales
- Flea markets
- Antique trails
- Charity sales

The platform combines:

- Event creation
- Interactive maps
- Public discovery
- Hyperlocal browsing
- Multi-home management
- Homeowner invite links
- SEO city pages
- Stripe-powered paid events

TreasureFinder should feel like:

> Airbnb + Facebook Marketplace + Zillow + Pinterest
> for garage sales and local treasure hunting.

---

# CORE PRODUCT VISION

TreasureFinder is NOT just:
- a garage sale event creator

TreasureFinder IS:
- a local discovery engine
- a treasure-hunting platform
- a garage sale marketplace
- a travel/discovery experience

Users should eventually be able to:
- browse local sales
- search by location
- search upcoming weekends
- discover sales while traveling
- plan routes
- find categories they love

Examples:
- “Garage sales in Florida this weekend”
- “Tool sales near me”
- “Estate sales near Naples Florida”
- “Community sales in Ohio”

---

# TARGET USERS

## A. ORGANIZERS

Examples:
- neighborhood coordinators
- churches
- HOAs
- schools
- retirees
- communities

They:
- create events
- invite homes
- manage approvals
- publish events

---

## B. HOMEOWNERS

Participating homes.

They:
- receive invite links
- manage their own listing
- upload photos
- submit listings

No login required for MVP.

---

## C. SHOPPERS / TREASURE HUNTERS

Public users.

They:
- browse sales
- search by location
- search by date
- use maps
- discover events
- travel to events

No login required.

---

# TECH STACK

Build with:

- Next.js
- React
- Tailwind CSS
- Supabase
- Supabase Auth
- Supabase Storage
- Stripe Checkout
- Google Maps API
- Vercel

Use TypeScript.

---

# APP ARCHITECTURE

The platform has THREE major systems:

1. Public Discovery Platform
2. Organizer Dashboard
3. Invite-Based Homeowner Listing System

---

# 1. PUBLIC DISCOVERY PLATFORM

This is the consumer-facing side.

Users can:
- search events
- browse events
- use maps
- view listings
- discover sales nearby

---

# HOMEPAGE

Route:
`/`

Homepage sections:

## Hero

Large search-focused hero.

Headline:

# Find Garage Sales, Estate Sales & Hidden Treasures Near You

Subheadline:

Discover neighborhood sales, estate sales, community events, tools, antiques, collectibles, and hidden gems happening this weekend.

Search bar:
- city
- ZIP/postal code
- state/province

Buttons:
- Find Sales
- Create Event

---

## Featured This Weekend

Show:
- featured events
- upcoming events
- popular events

Card format:
- event image
- event title
- city/state
- date
- number of homes

---

## Browse By Category

Categories:
- Tools
- Antiques
- Collectibles
- Furniture
- Artwork
- Electronics
- Pet Supplies
- Baby Items
- Estate Sales

---

## Browse By State

Examples:
- Ohio
- Florida
- Texas
- California

---

# SEARCH SYSTEM

Users should be able to search by:

- city
- ZIP/postal code
- state
- category
- date
- distance

---

# SEARCH RESULTS PAGE

Route:
`/search`

Filters:
- distance
- category
- event type
- date

Display:
- map
- event cards
- event previews

---

# EVENT PAGE

Route:
`/event/[slug]`

Each event page includes:

- hero image
- event title
- description
- event date/time
- city/state
- interactive map
- participating homes
- category filters
- QR code
- share buttons

---

# INTERACTIVE MAP

Use Google Maps API.

Map features:
- pins for each home
- click pin to preview listing
- directions button
- map clustering later

---

# PUBLIC EVENT CARDS

Each home card includes:
- address
- seller name
- categories
- featured items
- photos
- notes

Buttons:
- Get Directions
- Save Later (future)
- Share

---

# 2. ORGANIZER SYSTEM

Only organizers need authenticated accounts.

Organizers:
- purchase plans
- create events
- invite homes
- approve listings
- publish events

---

# STRIPE PLANS

## Starter Event
$19
Up to 5 homes

---

## Neighborhood Event
$39
Up to 20 homes

---

## Community Mega Event
$79
Up to 75 homes

---

# ORGANIZER DASHBOARD

Route:
`/dashboard`

Dashboard includes:

- active events
- pending approvals
- homes used
- event analytics later
- edit buttons

---

# CREATE EVENT FLOW

Organizer enters:
- title
- slug
- dates
- times
- city
- state
- address
- description
- banner image

---

# HOME INVITE SYSTEM

THIS IS A CRITICAL FEATURE.

Organizer does NOT manually manage all homes.

Instead:
- organizer invites homes
- homeowners manage their own listings

---

# INVITE WORKFLOW

Organizer clicks:
`Invite Home`

System creates:
- home record
- secure invite token

Example URL:
`/listing/k82js9xqv4`

Organizer sends link:
- text
- email
- Facebook Messenger

---

# 3. HOMEOWNER SYSTEM

NO LOGIN REQUIRED FOR MVP.

The invite token grants access.

---

# HOMEOWNER LISTING PAGE

Route:
`/listing/[token]`

Homeowner can:
- edit listing
- upload photos
- add categories
- add featured items
- save draft
- submit listing

Homeowner CANNOT:
- edit event
- publish event
- access dashboard
- see other homes

---

# LISTING STATUSES

Statuses:
- draft
- submitted
- approved
- needs_changes
- hidden

Only approved listings become public.

---

# DATABASE STRUCTURE

Use Supabase.

---

# TABLE: profiles

Fields:
- id
- user_id
- email
- full_name
- role
- created_at

---

# TABLE: events

Fields:
- id
- organizer_id
- title
- slug
- description
- event_date
- end_date
- start_time
- end_time
- city
- region
- country
- main_address
- latitude
- longitude
- status
- tier
- max_homes
- payment_status
- banner_image_url
- is_featured
- created_at

---

# TABLE: homes

Fields:
- id
- event_id
- seller_name
- seller_email
- seller_phone
- address
- latitude
- longitude
- description
- categories
- featured_items
- notes
- approval_status
- invite_token
- invite_status
- submitted_at
- approved_at
- last_edited_at
- created_at

---

# TABLE: home_photos

Fields:
- id
- home_id
- image_url
- caption
- sort_order
- created_at

---

# TABLE: payments

Fields:
- id
- organizer_id
- event_id
- stripe_session_id
- amount
- currency
- tier
- status
- created_at

---

# SUPABASE STORAGE

Bucket:
`garage-sale-photos`

Folder structure:
`events/{event_id}/homes/{home_id}`

---

# RLS RULES

Public:
- read approved listings from published events

Organizer:
- manage their own events and homes

Homeowners:
- access only via secure invite token

---

# MAP & GEOLOCATION

Use:
- Google Maps API
- Google Geocoding API

Store:
- latitude
- longitude

---

# SEO SYSTEM

IMPORTANT.

Create SEO-friendly pages.

Examples:
- /ohio
- /florida
- /columbus-ohio
- /naples-florida

Metadata:
- city
- event title
- categories
- dates

---

# VISUAL STYLE

The UI should feel:
- colorful
- warm
- exciting
- community-focused
- treasure-hunting
- approachable

Avoid:
- corporate SaaS styling
- cold dashboards
- enterprise complexity

---

# DESIGN STYLE

Use:
- rounded cards
- large buttons
- colorful accents
- playful map graphics
- warm backgrounds
- cheerful icons

---

# MOBILE FIRST

MOST USERS WILL BE MOBILE.

Optimize for:
- iPhone
- Android
- tablets

Large touch targets required.

---

# QR CODE SYSTEM

Each event generates:
- QR code
- downloadable PNG

Used for:
- flyers
- yard signs
- Facebook posts

---

# FUTURE FEATURES (NOT MVP)

DO NOT BUILD YET.

Future:
- shopper accounts
- favorites
- route planning
- notifications
- AI descriptions
- printed sign ordering
- local business sponsors
- recurring events
- homeowner accounts

---

# MVP PRIORITIES

Build THIS FIRST:

1. Homepage
2. Search system
3. Public event pages
4. Organizer dashboard
5. Stripe payments
6. Invite system
7. Homeowner editor
8. Maps
9. Image uploads
10. SEO pages

---

# FILE STRUCTURE

/app
  /dashboard
  /event
  /listing
  /search
  /pricing
  /api
  /admin

/components
/lib
/types
/styles

---

# ENVIRONMENT VARIABLES

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

# CURSOR IMPLEMENTATION INSTRUCTIONS

Build TreasureFinder as a production-ready MVP.

Requirements:

1. Use Next.js + Tailwind + Supabase + Stripe + Google Maps.
2. Public users browse without login.
3. Organizers authenticate and purchase event plans.
4. Organizers invite participating homes.
5. Homeowners use secure invite links without login.
6. Public users search and discover garage sales by location.
7. Build SEO-friendly city/state pages.
8. Use responsive mobile-first design.
9. Use secure invite tokens.
10. Use clean reusable components.
11. Add loading states and error handling.
12. Keep UX simple for older users.
13. Build scalable architecture for future expansion.

TreasureFinder should feel like:
“Treasure hunting meets local discovery.”
