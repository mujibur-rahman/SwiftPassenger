// @/screens/main/parcel/ParcelPickupLocationScreen.js
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StatusBar, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import StepProgress from "@/components/marketplace/StepProgress";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import { setPickupAddress, selectParcelDraft } from "@/features/parcel/parcelDeliverySlice";
import { DEFAULT_REGION } from "@/constants/defaultLocation";

export default function ParcelPickupLocationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const currentLocation = useSelector((s) => s.location?.currentLocation);
  const mapRef = useRef(null);

  const [text, setText] = useState(draft.pickupAddress?.address || "");
  const [coord, setCoord] = useState(
    draft.pickupAddress?.latitude
      ? { latitude: draft.pickupAddress.latitude, longitude: draft.pickupAddress.longitude }
      : null
  );

  useEffect(() => {
    if (coord && mapRef.current) {
      mapRef.current.animateToRegion({ ...coord, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 400);
    }
  }, [coord]);

  const handleSelect = (place) => {
    const next = { address: place.address, latitude: place.latitude, longitude: place.longitude, placeId: place.placeId || null };
    dispatch(setPickupAddress(next));
    setText(place.address);
    if (place.latitude != null && place.longitude != null) {
      setCoord({ latitude: place.latitude, longitude: place.longitude });
    }
  };

  const handleNext = () => {
    if (!draft.pickupAddress?.address && !text.trim()) {
      Alert.alert("Required", "Please select the parcel pickup location.");
      return;
    }
    if (!draft.pickupAddress?.latitude || !draft.pickupAddress?.longitude) {
      Alert.alert("Required", "Please select a location from the search results so we have exact coordinates.");
      return;
    }
    navigation.navigate("ParcelDeliveryLocation");
  };

  const initialRegion = currentLocation?.latitude
    ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : DEFAULT_REGION;

  const pinColor = colors?.primary || "#38BDF8";

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={initialRegion}
      >
        {coord && <Marker coordinate={coord} title="Pickup" description={text || "Parcel pickup"} pinColor={pinColor} />}
      </MapView>

      <View className="absolute left-0 right-0 px-4" style={{ top: insets.top + 8 }}>
        <View className="flex-row items-center gap-2">
          <Button icon="arrow-left" variant="card" size="md" fullWidth={false} onPress={() => navigation.goBack()} />
          <View className="flex-1 rounded-2xl border border-border bg-card px-3 py-2">
            <Text className="text-xs font-inter-medium text-foreground-muted">Pickup location</Text>
            <Text className="text-sm font-inter-semibold text-foreground" numberOfLines={1}>
              {text || "Search below"}
            </Text>
          </View>
        </View>
      </View>

      <View
        className="absolute left-0 right-0 rounded-t-3xl border-t border-border bg-card px-5 pt-4"
        style={{ bottom: 0, paddingBottom: insets.bottom + 16 }}
      >
        <View className="mb-3 h-1 w-10 self-center rounded-full bg-border" />
        <StepProgress current={1} total={9} />
        <Text className="mb-1 text-lg font-inter-bold text-foreground">Where should we collect the parcel?</Text>
        <Text className="mb-3 text-sm font-inter text-foreground-muted">Search for the pickup address.</Text>

        <View className="mb-4 z-50">
          <LocationAutocomplete
            label="Search pickup location"
            value={text}
            onChangeText={setText}
            onSelect={handleSelect}
            placeholder="Pickup address or place name"
            biasCoords={currentLocation}
          />
        </View>

        {/* {coord && (
          <View className="mb-3 flex-row items-center gap-2 rounded-xl bg-background-muted px-3 py-2.5">
            <Icon name="map-marker" size={18} color={pinColor} />
            <Text className="flex-1 text-sm font-inter-medium text-foreground" numberOfLines={2}>
              {text}
            </Text>
          </View>
        )} */}

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </View>
    </View>
  );
}
