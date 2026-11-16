# Backend setup: Supabase + Brevo

Signups go to **Supabase** (source of truth, queryable) and **Brevo** (email list + confirmation email).
Supabase is required. Brevo is optional and best-effort: if it is down or unset, signups still save.

Forms wired: Notify me (modal + command palette) -> `/api/notify`, Connect -> `/api/connect`, Contact -> `/api/contact`.
Still mocked (no UI uses a backend yet): poll, pin-code check, newsletter, in `src/lib/mock-api.ts`.

## 1. Supabase (about 5 min)

1. https://supabase.com > New project. Region: **Mumbai (ap-south-1)**. Save the DB password.
2. Left menu > **SQL Editor** > New query > paste all of `supabase/schema.sql` > **Run**.
   Expect "Success. No rows returned". It is safe to re-run.
3. **Project Settings > API** (or "API Keys"). Copy:
   - **Project URL** -> `SUPABASE_URL`
   - **service_role** key (or the new **secret** key) -> `SUPABASE_SERVICE_ROLE_KEY`
   - This key bypasses all security. Server only. Never `NEXT_PUBLIC_`, never commit it.
4. **Table Editor**: you should see `signups`, `connect_requests`, `contact_messages`, each marked RLS enabled.

## 2. Brevo (about 10 min)

1. https://www.brevo.com > sign up (free plan: 300 emails/day).
2. **Contacts > Lists > Create a list** ("hey launch list"). Open it, copy the numeric **ID** -> `BREVO_LIST_ID`.
3. **Contacts > Settings > Contact attributes > Add**: `FLAVOURS` (text) and `PIN_CODE` (text).
   (`SMS` already exists.) Lets you email "Dadi Masala people" or one city at launch.
   Skipping this is fine: the code retries without attributes.
4. **Senders, Domains & Dedicated IPs > Senders > Add** the address you will send from
   -> `BREVO_SENDER_EMAIL`. Verify it. For real inbox delivery, also **authenticate your domain**
   (add the DKIM and DMARC records Brevo shows you at your DNS host), otherwise mail lands in spam.
5. **SMTP & API > API Keys > Generate** -> `BREVO_API_KEY`.
   If you use "Authorised IPs", turn blocking off: Vercel IPs are not fixed.
6. New Brevo accounts may need transactional email activated. If the confirmation email does not arrive,
   check **Transactional > Logs** and contact Brevo support to enable it.

## 3. Environment variables

Local: add to `.env.local` (already gitignored).
Production: Vercel > Project > Settings > Environment Variables, then **redeploy**.

```
# required
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...

# optional but recommended
BREVO_API_KEY=...
BREVO_LIST_ID=3
BREVO_SENDER_EMAIL=hello@yourdomain.in
BREVO_SENDER_NAME=hey.
CONTACT_INBOX_EMAIL=you@yourdomain.in    # where Contact form messages are forwarded

# leave unset until the Turnstile widget is added (see below)
TURNSTILE_SECRET_KEY=
```

Restart `next dev` after editing env files.

## 4. Test it

Submit the Notify form. Then check:
- Supabase **Table Editor > signups**: one row, with `utm_*` if you landed with `?utm_source=...`.
- Brevo **Contacts**: the email is on your list; the confirmation email arrived.
- Submit the same email with another flavour: the toast says "Already on the list" and the row's `flavour_slugs` now holds both.

If the form shows the red retry banner, the route returned non-2xx. A `503 not_configured` means the Supabase env vars are missing.

## 5. Reading demand

SQL Editor, or Table Editor > Views:

```sql
select * from demand_by_flavour;   -- which flavour people want
select * from demand_by_pin;       -- where to ship first
select * from demand_by_channel;   -- which UTM source/campaign converts
select count(*) from signups;
```

## Known limits

- **Turnstile is not live.** The server verifies tokens only if `TURNSTILE_SECRET_KEY` is set, but the client
  still sends a placeholder token. Add the Cloudflare widget, make `getTurnstileToken` return its real token,
  then set the secret. Until then spam protection is the honeypot, validation, and the rate limiter.
- **Rate limiting is in-memory** (per server instance). It slows a single bot, not a distributed one.
- **WhatsApp** (AiSensy / Interakt) is not wired. It needs a business number and approved templates; the
  `signups.phone` column is ready for it.
- Newsletter, poll and pin-code check remain mocked.
