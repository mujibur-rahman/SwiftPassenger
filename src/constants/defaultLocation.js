/**
 * App-wide default map center when GPS / place coords are unavailable.
 * Ralph Terrace, Australia (Raymond Terrace, NSW area).
 */
export const DEFAULT_LOCATION = {
    latitude: -32.7615,
    longitude: 151.7441,
    address: "Ralph Terrace, Australia",
    city: "Ralph Terrace",
    country: "Australia",
};

/** Convenience for MapView initialRegion */
export const DEFAULT_REGION = {
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

/** Small offset helpers for demo markers near the default */
export function offsetFromDefault(dLat = 0, dLng = 0) {
    return {
        latitude: DEFAULT_LOCATION.latitude + dLat,
        longitude: DEFAULT_LOCATION.longitude + dLng,
    };
}
