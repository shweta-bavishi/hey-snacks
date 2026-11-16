/**
 * UTM tagging for every link we hand out (WhatsApp shares, bio links,
 * email, ads). Absolute http(s) URLs only: relative paths, #anchors and
 * mailto:/tel: are left untouched, since there is nothing to attribute.
 */
export type UtmParams = {
  /** Where the click comes from: "instagram", "whatsapp", "newsletter". */
  source: string;
  /** The channel type: "social", "share", "email", "cpc". */
  medium: string;
  /** The push it belongs to: "batch-01-prelaunch". */
  campaign: string;
  /** Tells two links in the same post apart: "bio", "story-sticker". */
  content?: string;
  term?: string;
};

const clean = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Adds utm_* to a URL. Existing utm_* params on the URL win, never overwritten. */
export function withUtm(url: string, utm: UtmParams): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return url;

  const entries: [string, string | undefined][] = [
    ["utm_source", utm.source],
    ["utm_medium", utm.medium],
    ["utm_campaign", utm.campaign],
    ["utm_content", utm.content],
    ["utm_term", utm.term],
  ];
  for (const [key, value] of entries) {
    if (!value || parsed.searchParams.has(key)) continue;
    const cleaned = clean(value);
    if (cleaned) parsed.searchParams.set(key, cleaned);
  }
  return parsed.toString();
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const UTM_STORAGE_KEY = "hey-utm";

export type StoredUtm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Remember the first-touch UTMs for this session, so a later signup can carry them. */
export function captureUtm(search: string) {
  const params = new URLSearchParams(search);
  const found: StoredUtm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 100);
  }
  if (Object.keys(found).length === 0) return;
  try {
    if (!sessionStorage.getItem(UTM_STORAGE_KEY)) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    }
  } catch {
    // Storage blocked: attribution is best-effort.
  }
}

export function readStoredUtm(): StoredUtm {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUtm) : {};
  } catch {
    return {};
  }
}
