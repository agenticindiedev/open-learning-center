# spec.md

## Purpose
Build Open Learning Center: a multi-community learning platform with free and paid access, YouTube-hosted lessons, 1-1 booking via Calendly, and group events with Google Meet links. MVP is a $49/mo subscription for friends and family.

## Non-Goals (Phase 1)
- Full Skool parity (feed, DMs, gamification, challenges, notifications)
- Native video hosting or live streaming
- File uploads for lesson resources
- AI product features beyond content topics

## Interfaces
Web:
- / (community catalog)
- /communities/[slug]
- /communities/[slug]/courses
- /courses/[courseSlug]/lessons/[lessonSlug]
- /events
- /bookings
- /account
- /admin

API:
- CRUD /communities
- CRUD /courses
- CRUD /lessons
- CRUD /events
- POST /memberships
- POST /progress
- POST /stripe/checkout
- POST /webhooks/stripe

## Key Decisions
- Next.js App Router frontend + NestJS API + MongoDB
- Clerk auth with email allowlist for admin access
- Stripe subscription billing: $49/mo unlocks all paid communities
- Lessons stored as Markdown + YouTube video ID
- Course structure: Community -> Course -> Lesson (no modules in MVP)
- Calendly booking link is global and gated to paid members
- Event entity stores Google Meet link, date/time, and access level
- Markdown editor with toolbar + live preview, published/unpublished state
- First lesson can be free preview in paid communities
- Import content from existing Markdown and skip *.video-prompt.md

## Edge Cases and Failure Modes
- Stripe webhook delays cause access mismatch
- Community switches from free to paid
- YouTube video ID invalid or unlisted without access
- Calendly link misconfigured
- Event time zone confusion

## Acceptance Criteria (Phase 1)
- Home lists free and paid communities with pricing badge
- Users sign in with Clerk
- Free community access is immediate
- Paid access unlocks after Stripe checkout
- Lessons render Markdown and YouTube embed
- Events show schedule and Google Meet join link
- Bookings page shows Calendly embed and is gated to paid members
- Admin editor supports create/edit/publish for communities, courses, lessons
- Lesson progress saved per user

## Test Plan
- Unit tests for membership gating and access checks
- Stripe webhook signature verification tests
- Event creation and access tests
- Lesson render tests with YouTube embed
