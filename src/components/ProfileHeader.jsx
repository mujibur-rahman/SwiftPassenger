import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/Colors";
import {
  useFonts,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import { getName } from "../utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProfileHeader = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    InstrumentSerif: InstrumentSerif_400Regular_Italic,
  });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.homeHeader}>
      <View style={styles.rowBetween}>
        <Text style={[styles.brand, { fontFamily: "InstrumentSerif" }]}>
          ZyroApp
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.avatar}>
          {true ? (
            <Text style={styles.avatarText}>{getName("Alex Carter")}</Text>
          ) : (
            <Ionicons name="person-add" size={20} color={COLORS.text} />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.greeting}>Good evening, Alex</Text>
      <Text style={styles.subGreeting}>What do you need today?</Text>
    </View>
  );
};

{
  /* <LinearGradient
  colors={["rgba(10,10,10,0.95)", "rgba(10,10,10,0.5)", "transparent"]}
  style={styles.topOverlay}
  pointerEvents="box-none"
>
  <View style={styles.topBar}>
    <View>
      <Text style={styles.greeting}>Good day 👋</Text>
      <Text style={styles.userName}>
        {user?.name?.split(" ")[0] || "Rider"}
      </Text>
    </View>
    <TouchableOpacity
      style={styles.avatar}
      onPress={() => navigation.navigate("Profile")}
    >
      <Text style={styles.avatarText}>
        {user?.name?.[0]?.toUpperCase() || "R"}
      </Text>
    </TouchableOpacity>
  </View>
</LinearGradient>; */
}

export default ProfileHeader;

const styles = StyleSheet.create({
  homeHeader: { marginBottom: 32, paddingTop: 20 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 26,
    color: COLORS.gold,
    fontWeight: "600",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1B1E27",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1B1E27",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.gold, fontWeight: "700" },
  greeting: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  subGreeting: { marginTop: 2, fontSize: 13, color: COLORS.subText },
});
