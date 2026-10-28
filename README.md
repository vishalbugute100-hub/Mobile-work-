# Passport — A Verified Work Identity Platform

A startup concept, market research, and working MVP for a **portable, verifiable
reputation layer for gig and trade workers** — think "LinkedIn + background check,
owned by the worker, consumable by any platform via API."

## Why this idea

Research into the current gig/trade-work and marketplace landscape surfaced a
recurring, un-addressed gap:

- The global gig economy is valued at **~$674B in 2026**, but it's fragmented —
  workers routinely juggle 4-6 different apps (TaskRabbit, Thumbtack, Handy,
  Instawork, etc.), rebuilding their reputation and re-passing background checks
  on every single one.
- **Trust & safety verification is itself a $15B market, growing ~15%/year** —
  and it's still broken: 39% of U.S. hiring managers report doing *extra*
  in-person verification specifically because digital credentials aren't
  trustworthy enough.
- Gig work is shifting from low-skill local tasks toward **skill-based,
  higher-value work**, which raises the stakes on trust — a plumber or
  electrician's credentials matter a lot more than a food-delivery rating.
- No single platform owns a worker's **portable identity** — every marketplace
  builds its own reputation silo. That's the missing infrastructure layer, not
  another marketplace.

Rather than building yet another two-sided marketplace (crowded, low
differentiation), Passport builds the **trust layer underneath all of them** —
a classic "infrastructure" play with stronger network effects: more workers
with Passports → more reason for platforms to integrate → more platforms
asking workers to get a Passport.

## The business model (two-sided, infrastructure-margin)

| Side | Offer | Price |
|---|---|---|
| Workers | Free core profile (build once, reuse everywhere) | Free |
| Workers | Premium verified badge + priority re-checks | $4.99/mo |
| Workers | Multi-trade credential wallet | $9.99/mo |
| Platforms/employers | Verification API call (pull a worker's trust score + credentials) | $0.15–$0.50/check |
| Platforms/employers | Bulk workforce screening | Volume contract |
| Platforms/employers | White-label trust widget embed | $499+/mo |

**Go-to-market:** start with one or two underserved trade verticals (e.g.
electricians, HVAC techs) where licensing/certification already creates a
natural verification hook, partner with trade associations for initial
distribution (cheap, high-trust channel), then expand trade-by-trade and
pitch existing gig platforms on integrating the API instead of building their
own verification stack.

**Why it scales:** the product itself (a profile + score) is cheap to serve;
the moat is the verified-data network, not infrastructure cost — classic
high-margin, high-leverage platform economics.

## What's in this repo (MVP demo)

A self-contained, client-side demo of the core loop — no backend required:

```
index.html                 Landing page / pitch (problem, how it works, pricing)
app/dashboard.html         Worker builds a profile, adds & "verifies" credentials
app/passport.html          The resulting shareable, public Trust Score page
assets/css/styles.css      Shared styling
assets/js/dashboard.js     Profile builder + live Trust Score calculation
assets/js/passport.js      Decodes & renders a shared Passport link
```

### How the demo works

1. Open `index.html` and click **"Build your Passport."**
2. Add your name, trade, and a few credentials (ID, license, employer
   reference, imported rating, job count), then hit **Verify** on each —
   this simulates the real verification calls a production system would make
   (ID-check provider, license registry lookup, employer confirmation, etc.).
3. Your **Trust Score** (0–100) is calculated live from verified credentials
   only — unverified claims don't count, which is the whole point of the
   product.
4. Click **"Generate my shareable Passport"** to get a public link. The demo
   encodes the verified profile into the URL itself (no server needed), so the
   link is fully shareable and works standalone — this stands in for what
   would be a real database-backed profile + REST API in production.
5. Open the link to see the public **Passport** page — this is what a hiring
   platform, client, or employer would see when checking someone's Passport.

### Running it

No build step — it's static HTML/CSS/JS.

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

### From demo to production

The demo intentionally fakes the parts that require real infrastructure, so
the architecture is obvious:

- `credential verification` → real integrations (ID verification provider,
  state license registries, employer/reference confirmation, OAuth pulls from
  existing gig platforms for rating history).
- `URL-encoded profile data` → a real backend (Postgres + an API) issuing
  stable Passport IDs, with the public passport page reading from `GET
  /v1/passport/:id` instead of a URL hash.
- `Trust Score formula` → a versioned, auditable scoring model (today: fixed
  weights per credential type — ID 20, license 30, employer reference 15,
  imported rating 15, job count 20 — capped at 100) that can evolve without
  breaking already-issued scores.
- `Platform API` → the actual revenue surface: authenticated `GET
  /v1/passport/:id` and bulk screening endpoints, billed per call.

## Research sources

- [45 Startup Ideas for 2026](https://wellows.com/blog/startup-ideas/)
- [Startup Ideas 2026: 50 AI Ideas Ranked](https://preuve.ai/blog/startup-ideas-2026)
- [15 Scalable Business Ideas for 2026](https://bigideasdb.com/scalable-business-ideas-2026)
- [50 Best Startup Ideas for 2026 (Ranked by Investors)](https://www.startupignition.com/news/best-startup-ideas-2026/)
- [10 Best Startup Ideas for 2026 That Are Actually Underserved](https://www.wtninsider.press/2026/01/top-10-startup-ideas-for-2026-that.html)
- [Gig Economy Jobs: Best Opportunities 2026](https://golance.com/blogs/gig-economy-jobs-2026)
- [Best Gig Work Apps and Gig Platforms in 2026](https://www.instawork.com/blog/gig-economy-platforms)
- [Gig Economy Platforms 2026: Sites Compared by Type & Skill](https://useme.com/en/blog/gig-economy-platforms/)
- [Gig Economy in 2026: Five Forces Reshaping Platform Hiring](https://fadv.com/article/gig-economy-2026-five-forces/)
