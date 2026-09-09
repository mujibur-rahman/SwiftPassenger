// @/components/ServiceCard.jsx
import React from "react";
import { Text, View, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/theme";
import SvgIcon from "@/components/ui/SvgIcon";

const ServiceCard = ({ job, onPress, iconSize = 28, className = "" }) => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  // const primary = colors?.primary;
  const textColor = colors?.foreground ?? (isDark ? '#F0F9FF' : '#0F172A');

  const handlePress = () => {
    if (onPress) {
      onPress(job);
      return;
    }
    if (job.id === "1" || job.title === "Ride") {
      navigation.navigate("RideBooking");
    } else if (job.id === "2" || job.title === "Order Food") {
      navigation.navigate("FoodSearch");
    } else if (job.id === "3" || job.title === "Gig jobs") {
      navigation.navigate("GigCategories")
    } else {
      // অন্য সার্ভিস পরে
      Alert.alert("Coming soon", `${job.title} is coming soon`);
    }
  };

  return (
    <Pressable
      className={`service-card ${className}`}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={job?.title}
    >
      <View className="service-card-circle">
        <SvgIcon name={job?.icon} size={iconSize} color={textColor} />
      </View>
      <Text className="service-card-title" numberOfLines={2}>
        {job?.title}
      </Text>
    </Pressable>
  );
};

export default ServiceCard;
