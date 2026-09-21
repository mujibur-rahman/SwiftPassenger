// @/screens/main/shop/RateShopOrderScreen.js
import React, { useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import RateReviewForm from "@/components/shared/RateReviewForm";
import { useRateShopOrderMutation } from "@/features/shop/shopApi";

const SHOP_REVIEW_TAGS = [
  "Arrived on time",
  "Good communication",
  "Careful with items",
  "Professional",
  "Helpful while shopping",
];

export default function RateShopOrderScreen({ route, navigation }) {
  const { isDark } = useTheme();

  const orderId = route.params?.orderId;
  const orderNumber = route.params?.orderNumber;
  const shopperName = route.params?.shopperName || "Your shopper";
  const shopperRating = route.params?.shopperRating;
  const shopperRatingCount = route.params?.shopperRatingCount;

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [rateShopOrder, { isLoading }] = useRateShopOrderMutation();

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    try {
      await rateShopOrder({ orderId, rating, tags, comment: text }).unwrap();
    } catch {
      // demo backend — still let the customer proceed
    }
    navigation.replace("ShopComplete", { orderNumber });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Rate & Review" onBack={() => navigation.goBack()} />
      </View>

      <RateReviewForm
        title="How was your shopping experience?"
        subjectName={shopperName}
        subjectSubtitle={shopperRating ? `★ ${shopperRating} (${shopperRatingCount ?? 0})` : undefined}
        subjectPhoto={null}
        rating={rating}
        onRatingChange={setRating}
        text={text}
        onTextChange={setText}
        tags={tags}
        onTagsChange={setTags}
        tagOptions={SHOP_REVIEW_TAGS}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Submit Review"
      />
    </View>
  );
}
