import { addBrevoContact } from "@/lib/server/brevo";
import { clientIp, json, rateLimited, readJson } from "@/lib/server/http";
import { isSupabaseConfigured, supabaseInsert } from "@/lib/server/supabase";
import { parseConnect } from "@/lib/server/validate";

export async function POST(request: Request) {
  if (rateLimited(`connect:${clientIp(request)}`)) return json({ error: "slow_down" }, 429);

  const parsed = parseConnect(await readJson(request));
  if (!parsed.ok) return json({ error: "invalid" }, 400);
  const { email, phone, flavourSlug, utm } = parsed.value;

  if (!isSupabaseConfigured()) return json({ error: "not_configured" }, 503);

  try {
    await supabaseInsert("connect_requests", {
      email,
      phone,
      flavour_slug: flavourSlug ?? null,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
    });
  } catch (error) {
    console.error("[connect] store failed", error);
    return json({ error: "store_failed" }, 502);
  }

  await addBrevoContact({ email, phone });
  return json({ ok: true });
}
