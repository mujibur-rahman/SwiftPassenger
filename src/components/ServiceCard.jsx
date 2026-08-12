// src/components/ServiceCard.jsx
import { Text, View, Pressable } from "react-native";
import SvgIcon from "../components/ui/SvgIcon";
import { useNavigation } from "@react-navigation/native";

const ServiceCard = ({ job }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (job.id === "1" || job.title === "Ride") {
      navigation.navigate("RideBooking");
    } else {
      // অন্য সার্ভিস পরে
      // Alert.alert("Coming soon", `${job.title} is coming soon`);
    }
  };

  return (
    <Pressable className="w-[30%] items-center" onPress={handlePress}>
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
