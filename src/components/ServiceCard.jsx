import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import SvgIcon from "../components/ui/SvgIcon";
// import { useNavigation } from "@react-navigation/native";

const ServiceCard = ({ job }) => {
  // const navigation = useNavigation();
  return (
    <Pressable
      className="w-[30%] items-center"
      // onPress={() => navigation.navigate("RideBooking")}
    >
      <View className="service-card-circle mb-2.5">
        <SvgIcon name={job.icon} size={32} color="#38BDF8" />
      </View>

      <Text className="service-card-title" numberOfLines={2}>
        {job.title}
      </Text>
    </Pressable>
  );
};

export default ServiceCard;
