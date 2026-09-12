// @/components/shared/RateReviewForm.jsx
// Global rate & review UI — reuse for Gig, Marketplace, Food, etc.
import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import AppTextInput from "@/components/ui/AppTextInput";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export const DEFAULT_REVIEW_TAGS = [
    "Arrived on time",
    "Good communication",
    "Quality work",
    "Professional",
    "Good value",
];

/**
 * Controlled rate/review form.
 *
 * Props:
 * - title?: string
 * - subtitle?: string
 * - subjectName?: string
 * - subjectPhoto?: require() | { uri } | number
 * - subjectSubtitle?: string
 * - rating, onRatingChange
 * - text, onTextChange
 * - tags, onTagsChange
 * - tagOptions?: string[]
 * - showTags?: boolean (default true)
 * - showText?: boolean (default true)
 * - onSubmit, isSubmitting, submitLabel
 * - minRating?: number (default 1 to enable submit)
 */
export default function RateReviewForm({
    title = "How was your experience?",
    subtitle,
    subjectName,
    subjectPhoto,
    subjectSubtitle,
    rating = 0,
    onRatingChange,
    text = "",
    onTextChange,
    tags = [],
    onTagsChange,
    tagOptions = DEFAULT_REVIEW_TAGS,
    showTags = true,
    showText = true,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Submit review",
    minRating = 1,
    className = "",
}) {
    const { colors, isDark } = useTheme();
    const warning = colors?.warning ?? "#FBBF24";
    const mutedStar = colors?.foregroundMuted ?? "#94A3B8";

    const toggleTag = (tag) => {
        if (tags.includes(tag)) {
            onTagsChange?.(tags.filter((t) => t !== tag));
        } else {
            onTagsChange?.([...tags, tag]);
        }
    };

    const canSubmit = rating >= minRating && !isSubmitting;

    return (
        <View className={`flex-1 ${className}`}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Subject (driver / provider / restaurant) */}
                {(subjectName || subjectPhoto) && (
                    <View className="mb-5 items-center">
                        <View className="mb-2">
                            {subjectPhoto ? (
                                <Image
                                    source={subjectPhoto}
                                    style={{ width: 64, height: 64, borderRadius: 32 }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Avatar name={subjectName} size={64} />
                            )}
                        </View>
                        {subjectName ? (
                            <Text className="text-base font-inter-bold text-foreground">
                                {subjectName}
                            </Text>
                        ) : null}
                        {subjectSubtitle ? (
                            <Text className="mt-0.5 text-sm font-inter text-foreground-muted">
                                {subjectSubtitle}
                            </Text>
                        ) : null}
                    </View>
                )}

                <Text className="mb-1 text-center text-base font-inter-semibold text-foreground">
                    {title}
                </Text>
                {subtitle ? (
                    <Text className="mb-4 text-center text-sm font-inter text-foreground-muted">
                        {subtitle}
                    </Text>
                ) : (
                    <View className="mb-4" />
                )}

                {/* Stars */}
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
                                color={star <= rating ? warning : mutedStar}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tags */}
                {showTags && tagOptions?.length > 0 && (
                    <View className="mb-5 flex-row flex-wrap gap-2">
                        {tagOptions.map((tag) => {
                            const active = tags.includes(tag);
                            return (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => toggleTag(tag)}
                                    className={`rounded-full border px-3.5 py-2 ${active ? "border-primary bg-primary/10" : "border-border bg-card"
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-inter-medium ${active ? "text-primary" : "text-foreground-muted"
                                            }`}
                                    >
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Written review */}
                {showText && (
                    <AppTextInput
                        label="Your review (optional)"
                        value={text}
                        onChangeText={onTextChange}
                        placeholder="Tell us more about your experience…"
                        multiline
                        numberOfLines={4}
                    />
                )}
            </ScrollView>

            {onSubmit && (
                <View className="px-5 pb-5">
                    <Button
                        onPress={onSubmit}
                        disabled={!canSubmit}
                        loading={isSubmitting}
                        fullWidth
                    >
                        {submitLabel}
                    </Button>
                </View>
            )}
        </View>
    );
}
