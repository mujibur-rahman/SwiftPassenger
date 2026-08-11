import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import SvgIcon from "../components/ui/SvgIcon";

const ServiceCard = ({ job }) => {
  return (
    <Pressable className="w-[30%] items-center">
      <View className="service-card-circle mb-2.5">
        <SvgIcon name={job.icon} size={32} color={job.iconColor} />
      </View>

      <Text className="service-card-title" numberOfLines={2}>
        {job.title}
      </Text>
    </Pressable>
  );
};

export default ServiceCard;