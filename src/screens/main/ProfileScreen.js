// src/screens/main/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSocket } from "../../services/SocketContext";
import { logout } from "../../features/auth/authSlice";
import Button from "../../components/ui/Button";
import ProfileHeader from "../../components/ui/ProfileHeader";
import ScreenHeader from "../../components/ui/ScreenHeader";

const MenuItem = ({
  icon,
  label,
  value,
  badge,
  onPress,
  error = false,
  isLast = false,
}) => (
  <TouchableOpacity
    className={`flex-row items-center gap-3 px-4 py-3.5 ${
      !isLast ? "border-b border-border" : ""
    }`}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <View
      className={`h-9 w-9 items-center justify-center rounded-full ${
        error ? "bg-error/15" : "bg-background-muted"
      }`}
    >
      <Icon name={icon} size={18} color={error ? "#F87171" : "#7DD3FC"} />
    </View>

    <Text
      className={`flex-1 text-[15px] font-sans-medium ${
        error ? "text-error" : "text-foreground"
      }`}
    >
      {label}
    </Text>

    <View className="flex-row items-center gap-1.5">
      {badge ? (
        <Text className="text-[13px] font-sans-medium text-primary">
          {badge}
        </Text>
      ) : null}
      {value ? (
        <Text className="text-[13px] font-sans text-foreground-muted">
          {value}
        </Text>
      ) : null}
      {onPress ? (
        <Icon
          name="chevron-right"
          size={18}
          color={error ? "#F87171" : "#7DD3FC"}
        />
      ) : null}
    </View>
  </TouchableOpacity>
);

const Section = ({ title, children }) => (
  <View className="mb-4 px-5">
    <Text className="mb-2 ml-1 text-xs font-sans-semibold tracking-wide text-foreground-muted">
      {title}
    </Text>
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      {children}
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((s) => s.auth);
  const { history } = useSelector((s) => s.ride);
  const { disconnect } = useSocket();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "R";

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${user?.name || "me"} on SwiftRide!`,
      });
    } catch (e) {
      // user cancelled
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="You"
          showBack={false}
          rightIcon="cog-outline"
          rightVariant="plain"
          rightIconSize={24}
          className="px-5"
          titleClassName="text-2xl"
          onRightPress={() =>
            Alert.alert("Settings", "App settings coming soon!")
          }
        />

        <ProfileHeader
          name={user?.name || "Rider"}
          subtitle={
            [user?.phone, user?.email].filter(Boolean).join(" · ") || "@rider"
          }
          avatarSize={64}
          verified
          onPress={() => navigation.navigate("EditProfile")}
          className="mt-5 px-5"
        />

        {/* ── Stats ── */}
        <View className="mx-5 mt-5 flex-row items-center justify-around rounded-2xl border border-border bg-card py-4">
          {[
            { label: "Trips", value: history?.length || 0 },
            { label: "Rating", value: user?.rating || "5.0" },
            { label: "Saved", value: user?.savedPlaces?.length || 0 },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View className="h-8 w-px bg-border" />}
              <View className="flex-1 items-center">
                <Text className="text-xl font-sans-bold text-foreground">
                  {s.value}
                </Text>
                <Text className="mt-0.5 text-xs font-sans text-foreground-muted">
                  {s.label}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Action buttons ── */}
        <View className="mx-5 mt-4 flex-row gap-3">
          <View className="flex-1">
            <Button
              variant="primary"
              size="md"
              onPress={() => navigation.navigate("EditProfile")}
            >
              Edit profile
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onPress={handleShare}
            >
              Share
            </Button>
          </View>
        </View>
        {/* ── Account ── */}
        <View className="mt-6">
          <Section title="Account">
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
              isLast
            />
          </Section>
        </View>
        {/* ── Preferences ── */}
        <Section title="Preferences">
          <MenuItem
            icon="credit-card-outline"
            label="Payment Methods"
            value="Visa •• 4829"
            onPress={() => navigation.navigate("PaymentMethods")}
          />
          <MenuItem
            icon="bell-outline"
            label="Notifications"
            badge="3 new"
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
            isLast
          />
        </Section>
        {/* ── Support ── */}
        <Section title="Support">
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
            isLast
          />
        </Section>
        {/* ── Sign out ── */}
        <View className="mb-2 px-5">
          <View className="overflow-hidden rounded-2xl border border-border bg-card">
            <MenuItem
              icon="logout"
              label="Sign Out"
              error
              onPress={handleLogout}
              isLast
            />
          </View>
        </View>
        <Text className="mt-4 text-center text-xs font-sans text-foreground-muted">
          SwiftRide Passenger v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
