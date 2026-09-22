import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  setSearch,
  selectRentalSearch,
} from "@/features/rental/rentalSlice";

function formatDate(d) {
  if (!d) return "Select date";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function addDays(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export default function CarRentalHomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const search = useSelector(selectRentalSearch);

  const [pickupLoc, setPickupLoc] = useState(
    search.pickupLocation || "Hobart, Tasmania, Australia"
  );
  const [dropoffLoc, setDropoffLoc] = useState(search.dropoffLocation || "");
  const [sameDropoff, setSameDropoff] = useState(true);

  // Default: today + 3 days
  const todayIso = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t.toISOString();
  }, []);

  const [pickupDate, setPickupDate] = useState(
    search.pickupDate || todayIso
  );
  const [returnDate, setReturnDate] = useState(
    search.returnDate || addDays(todayIso, 3)
  );
  const [pickupTime, setPickupTime] = useState(search.pickupTime || "10:00");
  const [returnTime, setReturnTime] = useState(search.returnTime || "10:00");

  const primary = colors?.primary ?? "#38BDF8";
  const muted = colors?.foregroundMuted ?? "#7DD3FC";

  const handleSearch = () => {
    dispatch(
      setSearch({
        pickupLocation: pickupLoc,
        dropoffLocation: sameDropoff ? pickupLoc : dropoffLoc,
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
      })
    );
    navigation.navigate("CarList");
  };

  // Simple date shift helpers (no date picker dependency)
  const shiftPickup = (delta) => {
    const next = addDays(pickupDate, delta);
    setPickupDate(next);
    if (new Date(next) >= new Date(returnDate)) {
      setReturnDate(addDays(next, 1));
    }
  };
  const shiftReturn = (delta) => {
    const next = addDays(returnDate, delta);
    if (new Date(next) > new Date(pickupDate)) {
      setReturnDate(next);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Car Rental" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="mb-6 rounded-2xl bg-card border border-border p-5">
          <Text className="text-2xl font-inter-bold text-foreground mb-1">
            Rent a car easily
          </Text>
          <Text className="text-sm text-foreground-muted">
            Choose dates, pick your car & drive away
          </Text>
        </View>

        {/* Pickup location */}
        <Text className="text-sm font-inter-semibold text-foreground-muted mb-2">
          Pickup location
        </Text>
        <View className="flex-row items-center bg-card border border-border rounded-xl px-3 mb-4">
          <Icon name="map-marker" size={20} color={primary} />
          <TextInput
            className="flex-1 py-3.5 px-3 text-base text-foreground"
            placeholder="City or address"
            placeholderTextColor={muted}
            value={pickupLoc}
            onChangeText={setPickupLoc}
          />
        </View>

        {/* Same dropoff toggle */}
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setSameDropoff(!sameDropoff)}
          activeOpacity={0.7}
        >
          <Icon
            name={sameDropoff ? "checkbox-marked" : "checkbox-blank-outline"}
            size={22}
            color={primary}
          />
          <Text className="ml-2 text-sm text-foreground">
            Return to same location
          </Text>
        </TouchableOpacity>

        {!sameDropoff && (
          <>
            <Text className="text-sm font-inter-semibold text-foreground-muted mb-2">
              Drop-off location
            </Text>
            <View className="flex-row items-center bg-card border border-border rounded-xl px-3 mb-4">
              <Icon name="map-marker-outline" size={20} color={primary} />
              <TextInput
                className="flex-1 py-3.5 px-3 text-base text-foreground"
                placeholder="City or address"
                placeholderTextColor={muted}
                value={dropoffLoc}
                onChangeText={setDropoffLoc}
              />
            </View>
          </>
        )}

        {/* Dates */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-card border border-border rounded-xl p-3">
            <Text className="text-xs text-foreground-muted mb-1">Pickup</Text>
            <Text className="text-base font-inter-semibold text-foreground">
              {formatDate(pickupDate)}
            </Text>
            <View className="flex-row mt-2 gap-2">
              <TouchableOpacity
                onPress={() => shiftPickup(-1)}
                className="h-8 w-8 items-center justify-center rounded-full bg-background-muted"
              >
                <Icon name="minus" size={16} color={primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shiftPickup(1)}
                className="h-8 w-8 items-center justify-center rounded-full bg-background-muted"
              >
                <Icon name="plus" size={16} color={primary} />
              </TouchableOpacity>
            </View>
            <TextInput
              className="mt-2 text-sm text-foreground border-t border-border pt-2"
              value={pickupTime}
              onChangeText={setPickupTime}
              placeholder="10:00"
              placeholderTextColor={muted}
            />
          </View>

          <View className="flex-1 bg-card border border-border rounded-xl p-3">
            <Text className="text-xs text-foreground-muted mb-1">Return</Text>
            <Text className="text-base font-inter-semibold text-foreground">
              {formatDate(returnDate)}
            </Text>
            <View className="flex-row mt-2 gap-2">
              <TouchableOpacity
                onPress={() => shiftReturn(-1)}
                className="h-8 w-8 items-center justify-center rounded-full bg-background-muted"
              >
                <Icon name="minus" size={16} color={primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shiftReturn(1)}
                className="h-8 w-8 items-center justify-center rounded-full bg-background-muted"
              >
                <Icon name="plus" size={16} color={primary} />
              </TouchableOpacity>
            </View>
            <TextInput
              className="mt-2 text-sm text-foreground border-t border-border pt-2"
              value={returnTime}
              onChangeText={setReturnTime}
              placeholder="10:00"
              placeholderTextColor={muted}
            />
          </View>
        </View>

        <Button onPress={handleSearch} className="mt-2">
          Search Cars
        </Button>

        {/* Quick info */}
        <View className="mt-8 flex-row flex-wrap gap-3">
          {[
            { icon: "shield-check", label: "Full insurance options" },
            { icon: "clock-fast", label: "Flexible cancellation" },
            { icon: "star", label: "Top-rated fleet" },
          ].map((item) => (
            <View
              key={item.label}
              className="flex-row items-center bg-card border border-border rounded-full px-3 py-2"
            >
              <Icon name={item.icon} size={16} color={primary} />
              <Text className="ml-1.5 text-xs text-foreground-muted">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
