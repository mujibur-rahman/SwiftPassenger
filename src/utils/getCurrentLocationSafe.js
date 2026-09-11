// src/utils/getCurrentLocationSafe.js
import { Platform } from "react-native";
import * as Location from "expo-location";

/**
 * Safe wrapper around expo-location.
 * Returns { latitude, longitude, accuracy } or null.
 * Never throws.
 *
 * Order:
 * 1. Permission
 * 2. Services enabled
 * 3. Last known position (fast, works better on emulator)
 * 4. Fresh getCurrentPositionAsync
 */
export async function getCurrentLocationSafe(options = {}) {
  const {
    accuracy = Location.Accuracy.Balanced,
    maximumAge = 60000,
    timeout = 20000,
  } = options;

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("[Location] Permission not granted:", status);
      return null;
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      console.log("[Location] Location services disabled on device/emulator");
      return null;
    }

    // Android: try to enable network provider (helps some emulators)
    if (Platform.OS === "android") {
      try {
        await Location.enableNetworkProviderAsync();
      } catch {
        // ignore — not available on all devices
      }
    }

    // 1) Prefer last known (often works on emulator after setting mock location)
    try {
      const last = await Location.getLastKnownPositionAsync({
        maximumAge,
        requiredAccuracy: 5000,
      });
      if (last?.coords?.latitude != null) {
        console.log("[Location] Using last known position");
        return {
          latitude: last.coords.latitude,
          longitude: last.coords.longitude,
          accuracy: last.coords.accuracy,
        };
      }
    } catch (e) {
      console.log("[Location] getLastKnownPositionAsync:", e?.message || e);
    }

    // 2) Fresh position
    const loc = await Location.getCurrentPositionAsync({
      accuracy,
      maximumAge,
      timeout,
      mayShowUserSettingsDialog: true,
    });

    if (!loc?.coords) {
      console.log("[Location] No coords in response");
      return null;
    }

    console.log("[Location] Got current position");
    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
    };
  } catch (e) {
    console.log("[Location] Error:", e?.message || e);
    return null;
  }
}
