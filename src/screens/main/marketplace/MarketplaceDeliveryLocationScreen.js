// @/screens/main/marketplace/MarketplaceDeliveryLocationScreen.js
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StatusBar, Alert, Keyboard } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import StepProgress from "@/components/marketplace/StepProgress";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import {
  setDeliveryAddress,
  setDraftField,
  selectMarketplaceDraft,
} from "@/features/marketplace/marketplacePickupSlice";

const DEFAULT_REGION = {
  latitude: 23.8103,
  longitude: 90.4125,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

export default function MarketplaceDeliveryLocationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);
  const currentLocation = useSelector((s) => s.location?.currentLocation);
  const mapRef = useRef(null);

  const [text, setText] = useState(draft.deliveryAddress?.address || "");
  const [receiverPhone, setReceiverPhone] = useState(draft.receiverPhone || "");
  const [deliveryCoord, setDeliveryCoord] = useState(
    draft.deliveryAddress?.latitude
      ? {
        latitude: draft.deliveryAddress.latitude,
        longitude: draft.deliveryAddress.longitude,
      }
      : null
  );

  const pickupCoord =
    draft.sellerAddress?.latitude != null
      ? {
        latitude: draft.sellerAddress.latitude,
        longitude: draft.sellerAddress.longitude,
      }
      : null;

  useEffect(() => {
    if (!mapRef.current) return;
    if (pickupCoord && deliveryCoord) {
      mapRef.current.fitToCoordinates([pickupCoord, deliveryCoord], {
        edgePadding: { top: 100, right: 40, bottom: 320, left: 40 },
        animated: true,
      });
    } else if (deliveryCoord) {
      mapRef.current.animateToRegion(
        { ...deliveryCoord, latitudeDelta: 0.02, longitudeDelta: 0.02 },
        400
      );
    }
  }, [deliveryCoord, pickupCoord?.latitude, pickupCoord?.longitude]);

  const handleSelect = (place) => {
    Keyboard.dismiss();
    dispatch(
      setDeliveryAddress({
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        placeId: place.placeId || null,
      })
    );
    setText(place.address);
    if (place.latitude != null && place.longitude != null) {
      setDeliveryCoord({
        latitude: place.latitude,
        longitude: place.longitude,
      });
    }
  };

  const handleNext = () => {
    if (!draft.deliveryAddress?.address && !text.trim()) {
      Alert.alert("Required", "Please select the delivery address.");
      return;
    }
    if (!draft.deliveryAddress?.latitude && text.trim()) {
      dispatch(
        setDeliveryAddress({
          address: text.trim(),
          latitude: null,
          longitude: null,
        })
      );
    }
    dispatch(setDraftField({ key: "receiverPhone", value: receiverPhone.trim() }));
    navigation.navigate("MarketplaceEstimate");
  };

  const initialRegion = currentLocation?.latitude
    ? {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    }
    : DEFAULT_REGION;

  const primary = colors?.primary || "#38BDF8";
  const success = colors?.success || "#34D399";

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={initialRegion}
      >
        {pickupCoord && (
          <Marker
            coordinate={pickupCoord}
            title="Pickup"
            description={draft.sellerName || "Seller"}
            pinColor={primary}
          />
        )}
        {deliveryCoord && (
          <Marker
            coordinate={deliveryCoord}
            title="Delivery"
            description={text || "Customer"}
            pinColor={success}
          />
        )}
        {pickupCoord && deliveryCoord && (
          <Polyline
            coordinates={[pickupCoord, deliveryCoord]}
            strokeColor={primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Top */}
      <View
        className="absolute left-0 right-0 px-4"
        style={{ top: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-2">
          <Button
            icon="arrow-left"
            variant="card"
            size="md"
            fullWidth={false}
            onPress={() => navigation.goBack()}
          />
          <View className="flex-1 rounded-2xl border border-border bg-card px-3 py-2">
            <Text className="text-xs font-inter-medium text-foreground-muted">
              Delivery location
            </Text>
            <Text className="text-sm font-inter-semibold text-foreground" numberOfLines={1}>
              {text || "Search below"}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <View
        className="absolute left-0 right-0 rounded-t-3xl border-t border-border bg-card px-5 pt-4"
        style={{ bottom: 0, paddingBottom: insets.bottom + 16, maxHeight: "55%" }}
      >
        <View className="mb-3 h-1 w-10 self-center rounded-full bg-border" />
        <StepProgress current={4} total={5} />

        {/* Mini route labels */}
        <View className="mb-3 flex-row items-start gap-3">
          <View className="items-center pt-1">
            <View className="h-2.5 w-2.5 rounded-full bg-primary" />
            <View className="my-1 h-6 w-0.5 bg-border" />
            <Icon name="map-marker" size={14} color={success} />
          </View>
          <View className="flex-1 gap-2">
            <Text className="text-xs text-foreground-muted" numberOfLines={1}>
              {draft.sellerName || "Pickup"} · {draft.sellerAddress?.address || "—"}
            </Text>
            <Text className="text-xs text-foreground-secondary" numberOfLines={1}>
              {text || "Delivery address"}
            </Text>
          </View>
        </View>

        <View className="mb-3 z-50">
          <LocationAutocomplete
            label="Delivery address"
            value={text}
            onChangeText={setText}
            onSelect={handleSelect}
            placeholder="Search delivery location"
            biasCoords={currentLocation}
          />
        </View>

        <View className="mb-3">
          <AppTextInput
            label="Receiver phone (optional)"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            placeholder="Contact at delivery"
            keyboardType="phone-pad"
          />
        </View>

        <Button onPress={handleNext} fullWidth>
          Get fare estimate
        </Button>
      </View>
    </View>
  );
}
