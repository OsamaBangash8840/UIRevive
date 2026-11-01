export function normalizeUrl(input: string): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Please enter a website URL." };
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProtocol);
    if (!u.hostname.includes(".") || u.hostname.endsWith(".")) {
      return { ok: false, error: "That doesn't look like a valid URL, e.g. example.com." };
    }
    return { ok: true, url: u.toString() };
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL, e.g. example.com." };
  }
}

