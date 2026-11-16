import { escapeHtml, sendBrevoEmail } from "@/lib/server/brevo";
import { clientIp, json, rateLimited, readJson } from "@/lib/server/http";
import { isSupabaseConfigured, supabaseInsert } from "@/lib/server/supabase";
import { parseContact } from "@/lib/server/validate";

export async function POST(request: Request) {
  if (rateLimited(`contact:${clientIp(request)}`, 4)) return json({ error: "slow_down" }, 429);

  const parsed = parseContact(await readJson(request));
  if (!parsed.ok) return json({ error: "invalid" }, 400);
  const { name, email, message } = parsed.value;

  if (!isSupabaseConfigured()) return json({ error: "not_configured" }, 503);

  try {
    await supabaseInsert("contact_messages", { name, email, message });
  } catch (error) {
    console.error("[contact] store failed", error);
    return json({ error: "store_failed" }, 502);
  }

  // Forward to the team inbox. Reply-To is the visitor, so "Reply" just works.
  const inbox = process.env.CONTACT_INBOX_EMAIL;
  if (inbox) {
    await sendBrevoEmail({
      to: inbox,
      replyTo: email,
      subject: `hey. contact: ${name}`,
      html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });
  }
  return json({ ok: true });
}
