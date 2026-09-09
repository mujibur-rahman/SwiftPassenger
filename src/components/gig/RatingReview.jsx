// @/components/gig/RatingReview.jsx
// Star rating + written review + selectable tag chips. Fully controlled —
// parent (RateReviewScreen) owns rating/text/tags state.
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import AppTextInput from "@/components/ui/AppTextInput";

export const REVIEW_TAGS = [
  "Arrived on time",
  "Good communication",
  "Quality work",
  "Professional",
  "Good value",
];

export default function RatingReview({
  rating = 0,
  onRatingChange,
  text = "",
  onTextChange,
  tags = [],
  onTagsChange,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const warning = colors?.warning ?? "#FBBF24";
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      onTagsChange?.(tags.filter((t) => t !== tag));
    } else {
      onTagsChange?.([...tags, tag]);
    }
  };

  return (
    <View className={className}>
      <Text className="mb-3 text-center text-base font-inter-semibold text-foreground">
        How was your experience?
      </Text>

      <View className="mb-5 flex-row items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange?.(star)}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel={`${star} star`}
          >
            <Icon
              name={star <= rating ? "star" : "star-outline"}
              size={36}
              color={star <= rating ? warning : "#94A3B8"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View className="mb-5 flex-row flex-wrap gap-2">
        {REVIEW_TAGS.map((tag) => {
          const active = tags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              className={`rounded-full border px-3.5 py-2 ${active ? "border-primary bg-primary/10" : "border-border bg-card"}`}
            >
              <Text
                className={`text-xs font-inter-medium ${active ? "text-primary" : "text-foreground-muted"}`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppTextInput
        label="Write a review (optional)"
        placeholder="Tell us more about your experience..."
        value={text}
        onChangeText={onTextChange}
        multiline
        numberOfLines={4}
      />
    </View>
  );
}
