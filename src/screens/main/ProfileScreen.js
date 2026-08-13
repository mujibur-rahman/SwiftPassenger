// src/screens/main/ProfileScreen.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSocket } from "../../services/SocketContext";
import { logout } from "../../features/auth/authSlice";

const MenuItem = ({ icon, label, value, onPress, error = false }) => (
  <TouchableOpacity
    className="flex-row items-center gap-3 border-b border-border px-4 py-4"
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <View
      className={`h-9 w-9 items-center justify-center rounded-[10px] ${
        error ? "bg-error/15" : "bg-primary/15"
      }`}
    >
      <Icon name={icon} size={20} color={error ? "#F87171" : "#38BDF8"} />
    </View>

    <Text
      className={`flex-1 text-[15px] font-sans ${
        error ? "text-error" : "text-foreground"
      }`}
    >
      {label}
    </Text>

    <View className="flex-row items-center gap-1.5">
      {value ? (
        <Text className="text-[13px] font-sans text-foreground-muted">
          {value}
        </Text>
      ) : null}
      {onPress ? <Icon name="chevron-right" size={18} color="#7DD3FC" /> : null}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((s) => s.auth);
  const { history } = useSelector((s) => s.ride);
  const { disconnect } = useSocket();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          disconnect?.();
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-10"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        className="items-center gap-1 bg-background-secondary px-6 pb-6"
        style={{ paddingTop: insets.top + 24 }}
      >
        <TouchableOpacity
          className="relative mb-3"
          onPress={() => navigation.navigate("EditProfile")}
          activeOpacity={0.8}
        >
          <View className="h-22 w-22 items-center justify-center rounded-full bg-primary">
            <Text className="text-[32px] font-sans-extrabold text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() || "R"}
            </Text>
          </View>

          <View className="absolute bottom-0 right-0 h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-background bg-primary">
            <Icon name="pencil" size={10} color="#060E1A" />
          </View>
        </TouchableOpacity>

        <Text className="text-[22px] font-sans-bold text-foreground">
          {user?.name || "Rider"}
        </Text>
        <Text className="text-sm font-sans text-foreground-muted">
          {user?.phone}
        </Text>
        {user?.email ? (
          <Text className="text-[13px] font-sans text-foreground-muted">
            {user.email}
          </Text>
        ) : null}

        {/* Stats */}
        <View className="mt-5 flex-row gap-10 border-t border-border pt-5">
          {[
            { label: "Trips", value: history?.length || 0 },
            { label: "Rating", value: user?.rating || "5.0" },
          ].map((s) => (
            <View key={s.label} className="items-center gap-0.5">
              <Text className="text-xl font-sans-bold text-foreground">
                {s.value}
              </Text>
              <Text className="text-xs font-sans text-foreground-muted">
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Account */}
      <View className="mb-2 px-4 pt-4">
        <Text className="mb-2 ml-1 text-xs font-sans-semibold tracking-wide text-foreground-muted">
          Account
        </Text>
        <View className="overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            icon="account-edit-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <MenuItem icon="phone-outline" label="Phone" value={user?.phone} />
          <MenuItem
            icon="email-outline"
            label="Email"
            value={user?.email || "Not set"}
            onPress={() => navigation.navigate("EditProfile")}
          />
          <MenuItem
            icon="shield-lock-outline"
            label="Privacy & Security"
            onPress={() =>
              Alert.alert("Privacy", "Privacy settings coming soon!")
            }
          />
        </View>
      </View>

      {/* Preferences */}
      <View className="mb-2 px-4">
        <Text className="mb-2 ml-1 text-xs font-sans-semibold tracking-wide text-foreground-muted">
          Preferences
        </Text>
        <View className="overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            icon="credit-card-outline"
            label="Payment Methods"
            onPress={() => navigation.navigate("PaymentMethods")}
          />
          <MenuItem
            icon="bell-outline"
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
          <MenuItem
            icon="map-marker-outline"
            label="Saved Places"
            onPress={() => navigation.navigate("SavedPlaces")}
          />
          <MenuItem
            icon="gift-outline"
            label="Promos & Offers"
            onPress={() => Alert.alert("Promos", "No active promos right now.")}
          />
        </View>
      </View>

      {/* Support */}
      <View className="mb-2 px-4">
        <Text className="mb-2 ml-1 text-xs font-sans-semibold tracking-wide text-foreground-muted">
          Support
        </Text>
        <View className="overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <MenuItem
            icon="chat-outline"
            label="Contact Us"
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <MenuItem
            icon="star-outline"
            label="Rate the App"
            onPress={() =>
              Alert.alert("Rate Us", "Thanks! Rating coming soon.")
            }
          />
        </View>
      </View>

      {/* Sign out */}
      <View className="mb-2 px-4">
        <View className="overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem
            icon="logout"
            label="Sign Out"
            error
            onPress={handleLogout}
          />
        </View>
      </View>

      <Text className="mt-4 text-center text-xs font-sans text-foreground-muted">
        ZyroApp Passenger v1.0.0
      </Text>
    </ScrollView>
  );
}
