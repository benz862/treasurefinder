# TreasureFinder — Multi-Home Invite System Architecture

This document explains how TreasureFinder should support organizer-paid events where homeowners manage their own listings through secure invite links.

## Core Concept

The organizer pays for the event and creates the garage sale.

Participating homeowners receive private invite links that allow them to manage ONLY their own listing.

Homeowners do NOT need accounts for the MVP.

---

# User Types

## 1. Organizer

Authenticated account.

Can:
- Create event
- Pay via Stripe
- Invite homes
- Approve listings
- Publish event
- Manage all homes in their event

## 2. Homeowner

No login required.

Receives secure invite link.

Can:
- Edit their own listing
- Upload photos
- Save draft
- Submit listing

Cannot:
- Access organizer dashboard
- Edit other homes
- Publish event
- View payments

## 3. Public Visitor

No login.

Can:
- Browse published events
- View approved listings
- Use maps and directions

---

# Invite Link Architecture

Each home listing gets a secure invite token.

Example:

https://treasurefinder.app/listing/k82js9xqv4

The token should:
- Be cryptographically secure
- Be 10–16 characters
- Not be guessable

The token grants access ONLY to that listing.

---

# Database Changes

Update homes table with:

- invite_token
- invite_status
- approval_status
- seller_email
- seller_phone
- submitted_at
- approved_at
- approved_by
- last_edited_at

Statuses:
- draft
- submitted
- approved
- needs_changes
- hidden

---

# Organizer Flow

1. Organizer purchases plan
2. Organizer creates event
3. Organizer invites homes
4. System generates invite links
5. Homeowners fill listings
6. Organizer approves listings
7. Event is published publicly

---

# Homeowner Flow

1. Homeowner opens invite link
2. Fills out listing
3. Uploads photos
4. Saves draft or submits listing
5. Organizer reviews submission

---

# Public Event Rules

Public pages should ONLY show:
- Published events
- Approved listings

---

# Stripe Tier Enforcement

Organizer plans determine maximum homes.

Starter:
- 5 homes

Neighborhood:
- 20 homes

Community:
- 75 homes

The organizer cannot exceed the plan limit.

---

# Suggested Routes

Public Event:
/event/[slug]

Private Homeowner Editor:
/listing/[token]

Organizer Dashboard:
/dashboard

---

# Recommended API Routes

/api/invite/create
/api/invite/deactivate
/api/invite/resend

/api/listing/save
/api/listing/submit
/api/listing/photos/upload

/api/events/publish
/api/listings/approve
/api/listings/reject

---

# Security Rules

Homeowners can only edit their assigned listing.

Organizers control:
- Publishing
- Approvals
- Event settings
- Invites

Public users can only view approved listings.

---

# UX Goals

The app should feel:
- Fun
- Friendly
- Community-driven
- Mobile-first
- Easy for older users

Avoid enterprise SaaS complexity.

---

# Cursor Implementation Prompt

Build a multi-home invite architecture for TreasureFinder.

Requirements:

1. Organizer is the only paid authenticated user.
2. Homeowners do not need login accounts.
3. Generate secure invite links for each home.
4. Homeowners can edit only their own listing.
5. Organizer controls approvals and publishing.
6. Public pages show only approved listings.
7. Use Supabase for database and storage.
8. Enforce Stripe plan limits.
9. Build production-ready architecture.
10. Keep UX extremely simple and mobile-friendly.
