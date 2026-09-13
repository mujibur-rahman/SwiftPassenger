// @/screens/main/food/RateFoodOrderScreen.js
import React, { useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import RateReviewForm from "@/components/shared/RateReviewForm";

export default function RateFoodOrderScreen({ route, navigation }) {
  const { isDark } = useTheme();

  const restaurantName = route.params?.restaurantName || "Restaurant";
  const orderId = route.params?.orderId;

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    try {
      setIsSubmitting(true);
      // TODO: wire up to your food review API endpoint here
      // e.g. await submitFoodReview({ orderId, rating, text, tags }).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Couldn't submit review", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Rate & Review" onBack={() => navigation.goBack()} />
      </View>

      <RateReviewForm
        subjectName={restaurantName}
        subjectPhoto={null}
        rating={rating}
        onRatingChange={setRating}
        text={text}
        onTextChange={setText}
        tags={tags}
        onTagsChange={setTags}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Submit review"
      />
    </View>
  );
}
