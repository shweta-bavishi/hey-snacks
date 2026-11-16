// Server-only. Talks to Supabase's REST API with the service role key, which
// bypasses RLS. Never import this from a client component, and never prefix
// these env vars with NEXT_PUBLIC_.

type SupabaseConfig = { url: string; key: string };

function readConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export function isSupabaseConfigured(): boolean {
  return readConfig() !== null;
}

async function request(path: string, body: unknown, extraHeaders: Record<string, string> = {}) {
  const config = readConfig();
  if (!config) throw new Error("Supabase is not configured");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      // Legacy service_role keys are JWTs and go in Authorization too. The
      // newer sb_secret_... keys are opaque and must only be sent as apikey.
      ...(config.key.startsWith("eyJ") ? { Authorization: `Bearer ${config.key}` } : {}),
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase ${path} failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response;
}

export async function supabaseRpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, args);
  return (await response.json()) as T;
}

export async function supabaseInsert(table: string, row: Record<string, unknown>): Promise<void> {
  await request(table, row, { Prefer: "return=minimal" });
}
