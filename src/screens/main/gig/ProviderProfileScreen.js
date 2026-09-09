// @/screens/main/gig/ProviderProfileScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { selectGigQuotes, selectQuote } from "@/features/gig/gigSlice";

export default function ProviderProfileScreen({ route, navigation }) {
  const { isDark, colors } = useTheme();
  const warning = colors?.warning ?? "#FBBF24";
  const dispatch = useDispatch();
  const quotes = useSelector(selectGigQuotes);
  const quote = quotes.find((q) => q.id === route.params?.quoteId);

  if (!quote) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="text-center text-sm font-inter text-foreground-muted">
          Provider not found.
        </Text>
      </View>
    );
  }

  const handleChoose = () => {
    dispatch(selectQuote(quote.id));
    navigation.navigate("ConfirmBooking");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Provider Profile" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View className="mb-5 items-center">
          <Avatar name={quote.providerName} uri={quote.providerPhoto} size={84} className="mb-3" />
          <Text className="text-lg font-inter-bold text-foreground">{quote.providerName}</Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Icon name="star" size={14} color={warning} />
            <Text className="text-sm font-inter-medium text-foreground-secondary">
              {quote.rating} · {quote.reviews} reviews
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row justify-around rounded-2xl border border-border bg-card py-4">
          <View className="items-center">
            <Text className="text-lg font-inter-bold text-primary">${Number(quote.price).toFixed(0)}</Text>
            <Text className="text-xs font-inter text-foreground-muted">Quoted price</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm font-inter-bold text-foreground">{quote.availability}</Text>
            <Text className="text-xs font-inter text-foreground-muted">Availability</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm font-inter-bold text-foreground">{quote.distance}</Text>
            <Text className="text-xs font-inter text-foreground-muted">Distance</Text>
          </View>
        </View>

        {quote.message ? (
          <View className="mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="mb-1 text-xs font-inter-semibold text-foreground-muted">Message</Text>
            <Text className="text-sm font-inter italic text-foreground-secondary">
              "{quote.message}"
            </Text>
          </View>
        ) : null}

        {quote.services?.length ? (
          <View className="mb-4">
            <Text className="mb-2 text-sm font-inter-semibold text-foreground">Services offered</Text>
            <View className="flex-row flex-wrap gap-2">
              {quote.services.map((service) => (
                <Badge key={service} label={service} variant="primary" shape="pill" size="sm" />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={handleChoose}>Choose This Provider</Button>
      </View>
    </View>
  );
}
