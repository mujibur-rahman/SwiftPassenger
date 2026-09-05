// src/services/places.js
const GOOGLE_API_KEY = "AIzaSyARjitdG1PXYmsk_L79FuJQUSyAxbBY7OM"; // ← replace

export async function autocompletePlaces(input, { lat, lng } = {}) {
  if (!input || input.trim().length < 2) return [];

  const params = new URLSearchParams({
    input: input.trim(),
    key: GOOGLE_API_KEY,
    language: "en",
    components: "country:au", // Bangladesh bias
  });

  // bias near current location
  if (lat && lng) {
    params.append("location", `${lat},${lng}`);
    params.append("radius", "50000");
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
  );
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.warn("Places autocomplete error:", data.status, data.error_message);
    return [];
  }

  return (data.predictions || []).map((p) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text || p.description,
    secondaryText: p.structured_formatting?.secondary_text || "",
  }));
}

export async function getPlaceDetails(placeId) {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "geometry,formatted_address,name",
    key: GOOGLE_API_KEY,
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
  );
  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error(data.error_message || "Place details failed");
  }

  const loc = data.result.geometry.location;
  return {
    latitude: loc.lat,
    longitude: loc.lng,
    address: data.result.formatted_address || data.result.name,
    name: data.result.name,
  };
}
