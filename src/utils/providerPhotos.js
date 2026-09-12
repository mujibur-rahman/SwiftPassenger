/**
 * Local provider avatars (lawn mowing demo).
 * Key by quote id and by lowercase provider name for flexible lookup.
 */
const BY_ID = {
  q1: require("@assets/images/gigs/lawn_mowing/providers/avatar-john.png"),
  q2: require("@assets/images/gigs/lawn_mowing/providers/avatar-mike.png"),
  q3: require("@assets/images/gigs/lawn_mowing/providers/avatar-greenleaf.png"),
  // numeric string ids from some APIs
  "1": require("@assets/images/gigs/lawn_mowing/providers/avatar-john.png"),
  "2": require("@assets/images/gigs/lawn_mowing/providers/avatar-mike.png"),
  "3": require("@assets/images/gigs/lawn_mowing/providers/avatar-greenleaf.png"),
};

const BY_NAME = {
  "john's lawn care": BY_ID.q1,
  "johns lawn care": BY_ID.q1,
  john: BY_ID.q1,
  "mike's mowing": BY_ID.q2,
  "mikes mowing": BY_ID.q2,
  mike: BY_ID.q2,
  greenleaf: BY_ID.q3,
  "greenleaf gardening": BY_ID.q3,
};

/**
 * Resolve a local require() image for a provider, or null if none.
 * @param {{ id?: string|number, providerName?: string, name?: string, providerPhoto?: any }} provider
 */
export function resolveProviderPhoto(provider = {}) {
  // Already a local require() module id (number) or valid remote string handled by caller
  if (provider.providerPhoto != null && typeof provider.providerPhoto !== "string") {
    return provider.providerPhoto;
  }
  if (typeof provider.providerPhoto === "number") {
    return provider.providerPhoto;
  }

  const id = provider.id != null ? String(provider.id) : null;
  if (id && BY_ID[id]) return BY_ID[id];

  const name = (provider.providerName || provider.name || "").toLowerCase().trim();
  if (name && BY_NAME[name]) return BY_NAME[name];

  // Partial name match
  if (name) {
    for (const key of Object.keys(BY_NAME)) {
      if (name.includes(key) || key.includes(name)) return BY_NAME[key];
    }
  }

  // Remote URL string — return as-is for Image { uri }
  if (typeof provider.providerPhoto === "string" && provider.providerPhoto.startsWith("http")) {
    return { uri: provider.providerPhoto };
  }

  return null;
}

export function enrichQuotesWithPhotos(quotes = []) {
  return quotes.map((q) => ({
    ...q,
    providerPhoto: resolveProviderPhoto(q) || q.providerPhoto || null,
  }));
}
