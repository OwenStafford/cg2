# Project Documentation & Roadmap

> Living document. Last updated: **2026-06-19**.
> Tracks what's built and what's planned. Check commit history (`git log`) for line-level detail.

A **bilingual (EN/FR) coffee e-commerce site**.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.2.9** (App Router) — note: this is a customized Next build, see `AGENTS.md`; read `node_modules/next/dist/docs/` before writing Next code |
| UI | React 19.2, Tailwind (see `globals.css`), `lucide-react` icons, `clsx` |
| i18n | `next-intl` 4.13 — locales `en` / `fr`, messages in `messages/{en,fr}.json`, routing under `src/app/[locale]/` |
| Database | **Postgres on Supabase**, accessed via **Drizzle ORM** (`drizzle-orm` + `postgres` driver) |
| Auth/Supabase | `@supabase/ssr` + `@supabase/supabase-js` (client + server helpers in `src/lib/supabase/`) |
| Cart state | **Zustand** (`src/lib/cart.ts`), persisted client-side |
| Payments | **Stripe** (`stripe` SDK v22) — Stripe-hosted Checkout (redirect) |

---

## What's Been Done ✅

### Foundation
- Next.js + Create Next App base, i18n (EN/FR) wired with `next-intl`, locale-prefixed routing, locale switcher. *(commits: `Initial commit`, `i18n`, `locale shift`)*
- Proxy/middleware setup (`src/proxy.ts`). *(commit: `proxy implementation`)*

### Pages / routes (`src/app/[locale]/`)
- `page.tsx` — home
- `about/` — About Us (with `FoundersPhoto` component) *(commits: `about us`)*
- `contact/` — contact details (real address/phone/fax/email)
- `customized/` — Custom Service page (blends, tea, baskets, fundraising)
- `shop/` — product listing
- `shop/[slug]/` — product detail
- `cart/` — cart page
- `checkout/` + `checkout/success/` — checkout entry + post-payment success
- `account/` — sign in / sign up / account view; `account/update-password/` — password-reset landing
- `/auth/callback` (route handler, outside `[locale]`) — Supabase email-confirm / recovery callback

### Data layer *(commits: `supabase config`, `drizzle and db setup`)*
- Supabase Postgres + Drizzle schema in `src/lib/db/schema.ts`.
- Seed scripts: `scripts/seed.ts`, `scripts/seed-data.ts`.
- **Tables:**
  - `products` — bilingual fields (name/origin/description/tasting_notes in EN+FR), `category` & `roast` enums, `price_cents`, `image_url`, `featured`, `in_stock`.
  - `customers` — email, full_name.
  - `orders` — `stripe_session_id` (unique), `status` enum, money fields (`subtotal/tax/shipping/total_cents`), `currency`, `shipping_address` (jsonb).
  - `order_items` — line items, FK to `orders` (cascade) and `products` (set null), snapshots name/price at purchase time.

### Cart *(commits: `cart work`, `cart`, `cart2`)*
- Zustand store (`src/lib/cart.ts`), `AddToCartButton`, `CartContents`, `CartIconWithBadge` (header badge), cart page.

### Stripe checkout *(commits: `stripe config`)* — **WORKING in test mode**
- `src/lib/stripe.ts` — Stripe client (`server-only`).
- `src/app/api/checkout/route.ts` — validates cart against DB (existence + stock), builds line items with bilingual product names, creates a **Checkout Session** (CAD, shipping to CA/US, locale-aware), returns hosted-checkout `url`.
- `src/app/api/webhooks/stripe/route.ts` — verifies signature, on `checkout.session.completed` (paid) writes `orders` + `order_items` (idempotent via unique `stripe_session_id`).
- `src/app/[locale]/checkout/success/page.tsx` — retrieves session, clears cart, shows order ref + total.
- `CheckoutButton`, `CartClearer` components.
- **Verified end-to-end** 2026-06-19: test purchase → webhook → order row in DB. ✅

### On-site embedded checkout modal *(2026-06-19)* — **DONE**
- Customers now check out **without leaving the site** — Stripe's Embedded Checkout renders in a modal.
- `src/app/api/checkout/route.ts` — switched to `ui_mode: "embedded_page"`, returns `client_secret` (+ `return_url`) instead of a hosted `url`.
- `src/lib/stripe-client.ts` — client-side `loadStripe` singleton (uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
- `src/components/CheckoutModal.tsx` — overlay hosting `<EmbeddedCheckoutProvider>` + `<EmbeddedCheckout>` (Esc to close, scroll lock, click-outside).
- `src/components/CheckoutButton.tsx` — fetches `client_secret` then opens the modal (errors like out-of-stock surface before the modal opens).
- Deps added: `@stripe/stripe-js`, `@stripe/react-stripe-js`.
- Webhook/order pipeline unchanged; success page still reached via `return_url`.

### Accounts & auth (email + password) *(2026-06-19)* — **DONE (code)**
- Supabase email/password auth: sign up, sign in, sign out, forgot-password, set-new-password.
- `src/app/[locale]/account/page.tsx` — auth form when logged out; account view (email, orders placeholder, sign-out) when logged in.
- `src/app/[locale]/account/actions.ts` — server actions (`signIn`, `signUp`, `signOut`, `requestPasswordReset`, `updatePassword`); messages localized via `getTranslations`.
- `src/components/AuthForm.tsx` — client form with sign-in / sign-up / forgot-password modes (`useActionState`).
- `src/app/[locale]/account/update-password/` + `src/components/UpdatePasswordForm.tsx` — reset-flow landing page.
- `src/app/auth/callback/route.ts` — handles email-confirm + recovery links (both PKCE `code` and `token_hash` OTP flows).
- `src/lib/auth-types.ts` — shared `AuthState` type (kept out of the `"use server"` file).
- `src/proxy.ts` — matcher now excludes `/auth` so the intl middleware doesn't locale-redirect the callback.
- i18n: new `auth` namespace (EN/FR).
- **⚠️ Requires Supabase dashboard config before the email flows work — see "Supabase auth setup" below.**

### Catalog & content import from the old site *(2026-06-19)* — **DONE**
- Imported the real catalog from **cafegourmet.ca** (WooCommerce) into `scripts/seed-data.ts` and seeded the DB: **46 products** — 27 coffee (18 single-origin/specialty + 9 signature blends), 15 teas, 4 gift baskets. Old fictional placeholder products were pruned.
- Real names, prices, and categories (old `signature-blend` → `coffee`, `baskets` → `gift`); descriptions/origins/tasting-notes were **rewritten + translated to FR** (improved, not verbatim — the originals were one-liners like "mild and sweet").
- **Contact page** (`/contact`) rebuilt with real info (Le Centre Café Gourmet, 1564 Ch. Herron Suite 201 Dorval; 514.631.1131; fax 866.234.1154; info@cafegourmet.ca), bilingual.
- **Custom Service page** (`/customized`, new) — custom blends, special-order tea, gift baskets (themes), Beans for Bucks fundraising; bilingual. Linked in Header + Footer (`nav.customService`).
- **About page** was already accurate (Don & Rita Stafford 1977, Greene Ave, Marché de l'Ouest 1981, daughters Lynn & Donna, charities, Dorval address) — left as-is.
- **Product images self-hosted in Supabase Storage** *(2026-06-19)* — all 44 unique images were downloaded from the old site and uploaded to a **public `product-images` bucket**; `imageUrl`s now point at `…supabase.co/storage/v1/object/public/product-images/…`. `next.config.ts` allows that host (cafegourmet.ca removed). Served/optimized through `next/image`. Upload used the `SUPABASE_SERVICE_ROLE_KEY` (secret key) via a one-off script.

### Order history, mobile & SEO *(2026-06-20)* — **DONE**
- **Past orders** on `/account` (matched by email) — date, ref, status badge, line items, total. `src/lib/orders.ts`, `formatDate`, `orders` i18n namespace.
- **Mobile**: `MobileMenu` (hamburger) — header nav was desktop-only. Cart-hydration gate moved to `useSyncExternalStore`.
- **SEO**: `src/lib/seo.ts` helper; per-page metadata + OG/Twitter, canonical + `hreflang`, `app/sitemap.ts`, `app/robots.ts`, JSON-LD (Organization + Product). Private pages `noindex`.

---

## Environment Variables

Local dev lives in `.env.local` (gitignored). Currently set:

| Var | Purpose | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key | |
| `DATABASE_URL` | Postgres connection (Supabase pooler) | used by Drizzle |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key (`sb_secret_…`) | server-only; used for Storage admin (image uploads). **Never expose client-side.** |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for SEO (canonical/OG/sitemap/robots) | optional; defaults to `https://cafegourmet.ca`. Set to the real deployed origin in prod. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable (`pk_test_…`) | used client-side by the embedded checkout modal |
| `STRIPE_SECRET_KEY` | Stripe secret (`sk_test_…`) | test mode |
| `STRIPE_WEBHOOK_SECRET` | from `stripe listen` (local) | **local-only**; production uses a separate Dashboard endpoint secret |

---

## Local Dev — Stripe Webhooks

Stripe CLI is installed (winget: `Stripe.StripeCli`). To test the full purchase flow, run **two terminals**:

```powershell
# Terminal 1 — app
npm run dev

# Terminal 2 — forward Stripe events to the local webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Test card: `4242 4242 4242 4242`, any future expiry, any CVC, any postal code.
The `stripe listen` signing secret is stable per account+machine (set-and-forget in `.env.local`).

---

## Supabase auth setup (required for account email flows)

In the Supabase dashboard (**Authentication**):

1. **URL Configuration** → set **Site URL** to `http://localhost:3000` (dev). Under **Redirect URLs**, add `http://localhost:3000/auth/callback`. (Add the production URLs too when deploying.)
2. **Email confirmation** (Providers → Email → "Confirm email"):
   - **For quick local testing:** turn it **OFF** — sign-up then logs in immediately, no email round-trip.
   - **For production:** leave it **ON**. The default email template uses `{{ .ConfirmationURL }}`, which redirects back to the Site URL with a `?code=` — our `/auth/callback` route exchanges that for a session. (No template edit needed for the code flow.)
3. Password reset works the same way: the reset email redirects to `/auth/callback?next=/<locale>/account/update-password`.

New Supabase projects default to **confirmation ON**.

---

## Roadmap / TODO 🚧

*(no particular order unless noted)*

- [ ] **Deploy to Vercel** — wants a low/no-cost demo link first (avoid spend for now). Hobby tier likely sufficient initially.
- [ ] **Get all envs onto Vercel** — port the `.env.local` values into Vercel project env vars (per-environment). Remember: production needs a **separate** `STRIPE_WEBHOOK_SECRET` from a Dashboard webhook endpoint, not the CLI one.
- [x] ~~**Custom Stripe checkout modal**~~ — ✅ done 2026-06-19 via Embedded Checkout (`ui_mode: 'embedded_page'`). See "What's Been Done".
- [x] ~~**Import all products from the previous site**~~ — ✅ done 2026-06-19 (46 products from cafegourmet.ca; contact + custom-service pages imported & translated too). See "What's Been Done".
- [x] ~~**Set up product pictures properly**~~ — ✅ done 2026-06-19 (downloaded from old site → public Supabase Storage `product-images` bucket → `next/image`). See "What's Been Done".
- [ ] **SSR / performance optimization (for ranking)** — owner wants a **high search rank**, and Core Web Vitals (LCP/CLS/INP) are a Google ranking factor, so treat perf as part of SEO. Scope: maximize static/server rendering + caching (shop, product, content pages should be static/ISR, not force-dynamic where avoidable), `next/image` everywhere (replace remaining plain `<img>` on home/product-detail), font/CSS optimization, lazy-load below-the-fold, audit with Lighthouse/PageSpeed + `next build` bundle analysis, aim for green CWV. Pairs with the SEO work already done.
- [x] ~~**Mobile support**~~ — ✅ done 2026-06-20. Added `MobileMenu` (hamburger + dropdown) — the header nav was desktop-only (`hidden md:flex`) with no mobile fallback. Smaller logo + tighter gaps on mobile; cart row tightened (hides redundant line-total < `sm`). Other pages were already mobile-first (grid-cols-1 → lg). Also replaced the cart's `mounted` hydration gate (setState-in-effect) with `useSyncExternalStore` in `CartContents` + `CartIconWithBadge` — cleaner and lint-clean.
- [x] ~~**SEO optimization**~~ — ✅ done 2026-06-20. Per-page metadata (title template, descriptions), OG/Twitter cards, canonical + `hreflang` (en/fr/x-default), `sitemap.xml` (all routes + products, localized), `robots.txt` (noindex account/cart/checkout), JSON-LD (Organization site-wide + Product per product). Helper: `src/lib/seo.ts`. **Set `NEXT_PUBLIC_SITE_URL` on deploy** (defaults to `https://cafegourmet.ca`). See "What's Been Done".
- [x] ~~**Accounts & auth**~~ — ✅ done 2026-06-19 (email + password via Supabase). See "What's Been Done". *Still needs the Supabase dashboard config below to be exercised end-to-end.*
- [x] ~~**Past orders & order-status page**~~ — ✅ done 2026-06-19. Logged-in customers see their order history (date, ref, status badge, line items, total) on `/account`, matched by email. `src/lib/orders.ts` (`getOrdersForEmail`), `formatDate` helper, `orders` i18n namespace. Orders link by email for now (no `customer_id` backfill yet).
- [ ] **Resend (transactional email)** — set up [Resend](https://resend.com) to email customers about order confirmation/status, etc. Hook into the Stripe webhook (`checkout.session.completed`) for the order-confirmation email; later wire status-change emails. Needs a Resend API key + verified sending domain.
  - **Resend should also take over all Supabase/auth emails** (sign-up confirmation, password reset, magic link, email-change) — point Supabase Auth's **custom SMTP** at Resend so every transactional email goes through Resend (one sender domain, branded templates) instead of Supabase's default mailer. Config in Supabase dashboard → Authentication → SMTP settings.
- [ ] **Logging / health dashboard** — observability so failures are debuggable (webhook errors, failed payments, server errors). Prefer **non-Google** options (e.g. Sentry for errors, Vercel's built-in logs/observability, Supabase logs, Axiom/Better Stack/Logtail) — only fall back to GCP if unavoidable. Could surface a health/logs view on the admin page. Owner's priority: "make sure I can debug if something goes wrong."
- [ ] **Editable site settings in DB** — store contact info / business details (address, phone, fax, email, hours, social links) in a `site_settings` table instead of hardcoded i18n strings, so they're editable from the admin console if the business relocates or changes numbers. Currently these live in `messages/{en,fr}.json` (contact + customService namespaces) — migrate them to the DB and have the contact/custom-service pages read from there. Bilingual values where relevant.
- [ ] **Admin dashboard** *(explicitly last)* — manage products/orders + edit site settings (above). (Natural home for the logging/health view too.)

### Go-live checklist (for when leaving test mode)
- **Production domain: `cafegourmet.ca`** (confirmed — the business will have access to it). Use it for `NEXT_PUBLIC_SITE_URL`, the Stripe prod webhook (`/api/webhooks/stripe`), and Supabase Auth Site URL + redirect (`/auth/callback`). The SEO setup already defaults canonical/sitemap/robots/OG to this domain.
- [ ] Activate Stripe account (business info, bank, tax details).
- [ ] Swap `sk_test_…`/`pk_test_…` → `sk_live_…`/`pk_live_…`.
- [ ] Create production webhook endpoint in Stripe Dashboard → put its `whsec_…` in Vercel env vars.

---

## Notes / Gotchas
- This is a **customized Next.js** — always read `node_modules/next/dist/docs/` before writing Next code (per `AGENTS.md`).
- Money is stored in **cents** (integers) everywhere.
- Product text fields are **bilingual** (`*_en` / `*_fr`) — keep both in sync when importing/editing.
- Order line items **snapshot** name/price at purchase, so later product edits don't rewrite history.
- **Stripe SDK (v22) pins a 2026 API version** — `ui_mode` values are `embedded_page` / `hosted_page` (NOT the older `embedded` / `hosted`). Watch for renamed enums vs. older Stripe docs/examples.
- **Cursor/select convention** (base rules in `globals.css`): `button` → `cursor: default` + `user-select: none`; `a` → `cursor: pointer`. For `<button>`s that act as links, add `cursor-pointer` (no underline, per owner preference).
