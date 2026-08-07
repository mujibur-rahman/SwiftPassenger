import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import SvgIcon from "../components/ui/SvgIcon";

const ServiceCard = ({ job }) => {
  return (
    <Pressable style={styles.card}>
      <View style={styles.iconWrapper}>
        {/* <Ionicons name={job.icon} size={26} color={COLORS.text} /> */}
        <SvgIcon name={job.icon} size={32} color={COLORS.gold} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {job.title}
      </Text>
    </Pressable>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    width: "30%",
    alignItems: "center",
  },

  // WhatsApp এর বাইরের circle
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: "#232A31",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },

  // Colored icon background
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    width: 90,
  },
});
