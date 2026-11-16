import { FLAVOURS } from "@/data/flavours";
import { addBrevoContact, sendBrevoEmail } from "@/lib/server/brevo";
import { clientIp, json, rateLimited, readJson, verifyTurnstile } from "@/lib/server/http";
import { isSupabaseConfigured, supabaseRpc } from "@/lib/server/supabase";
import { parseNotify } from "@/lib/server/validate";

type SignupRow = { ticket_no: number; was_created: boolean; merged_flavour_slugs: string[] };

const ticketLabel = (n: number) => `#${String(n).padStart(4, "0")}`;
const nameOf = (slug: string) => FLAVOURS.find((f) => f.slug === slug)?.name ?? slug;

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(`notify:${ip}`)) return json({ error: "slow_down" }, 429);

  const parsed = parseNotify(await readJson(request));
  if (!parsed.ok) return json({ error: "invalid" }, 400);
  const input = parsed.value;

  // Bots that fill the honeypot get the same success shape and nothing is stored.
  if (input.honeypot) {
    return json({ status: "created", ticket: "#0000", mergedFlavourSlugs: input.flavourSlugs });
  }

  if (!(await verifyTurnstile(input.turnstileToken, ip))) return json({ error: "bot_check_failed" }, 403);
  if (!isSupabaseConfigured()) return json({ error: "not_configured" }, 503);

  let row: SignupRow;
  try {
    const rows = await supabaseRpc<SignupRow[]>("notify_signup", {
      p_email: input.email,
      p_phone: input.phone ?? null,
      p_pin_code: input.pinCode ?? null,
      p_flavour_slugs: input.flavourSlugs,
      p_source: input.source ?? null,
      p_utm_source: input.utm.utm_source ?? null,
      p_utm_medium: input.utm.utm_medium ?? null,
      p_utm_campaign: input.utm.utm_campaign ?? null,
      p_utm_content: input.utm.utm_content ?? null,
      p_utm_term: input.utm.utm_term ?? null,
    });
    const first = rows[0];
    if (!first) throw new Error("notify_signup returned no row");
    row = first;
  } catch (error) {
    console.error("[notify] store failed", error);
    return json({ error: "store_failed" }, 502);
  }

  const flavourNames = row.merged_flavour_slugs.map(nameOf);
  const ticket = ticketLabel(row.ticket_no);

  // Await so serverless doesn't freeze before Brevo is called. Both are
  // failure-proof, so they can't break the response.
  await Promise.all([
    addBrevoContact({ email: input.email, phone: input.phone, flavourNames, pinCode: input.pinCode }),
    row.was_created
      ? sendBrevoEmail({
          to: input.email,
          subject: `Tum ${ticket} ho line mein`,
          html: `<p>Hey!</p><p>Tum <strong>${ticket}</strong> ho line mein. ${flavourNames.join(", ")}, note kar liya.</p><p>Batch 01 ready hote hi sabse pehle tumhe batayenge. Tab tak, makhana ko miss mat karna.</p><p>- hey.</p>`,
        })
      : Promise.resolve(),
  ]);

  return json({
    status: row.was_created ? "created" : "duplicate",
    ticket,
    mergedFlavourSlugs: row.merged_flavour_slugs,
  });
}
