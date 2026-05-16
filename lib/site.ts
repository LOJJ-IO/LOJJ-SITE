/** Canonical public origin for LOJJ (always https://www.lojj.io). */
export const CANONICAL_SITE_URL = "https://www.lojj.io";

/**
 * Resolves the site origin used in metadata, sitemap, and JSON-LD.
 * Normalizes env values and falls back when unset or invalid.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return CANONICAL_SITE_URL;
  }

  try {
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(href);

    if (url.hostname === "lojj.io" || url.hostname === "www.lojj.io") {
      url.hostname = "www.lojj.io";
    }

    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.origin;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

/** Absolute URL for a path on the canonical host (path must start with `/`). */
export function siteUrl(path: string = "/"): string {
  const base = getSiteUrl();
  if (path === "/" || path === "") {
    return `${base}/`;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
