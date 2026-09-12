// @/screens/main/gig/ProviderProfileScreen.js
import React from "react";
import { View, Text, Image, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ProviderAvatar } from "@/components/gig/QuoteCard";
import { selectGigQuotes, selectQuote } from "@/features/gig/gigSlice";

const PORTFOLIO_IMAGES = [
  require("@assets/images/gigs/lawn_mowing/portfolio/portfolio-1.jpg"),
  require("@assets/images/gigs/lawn_mowing/portfolio/portfolio-2.jpg"),
  require("@assets/images/gigs/lawn_mowing/portfolio/portfolio-3.jpg"),
];

function findQuote(quotes, quoteId) {
  if (quoteId == null || !quotes?.length) return null;
  const key = String(quoteId);
  return (
    quotes.find((q) => String(q.id) === key) ||
    quotes.find((q) => String(q.quoteId) === key) ||
    null
  );
}

export default function ProviderProfileScreen({ route, navigation }) {
  const { isDark, colors } = useTheme();
  const warning = colors?.warning ?? "#FBBF24";
  const dispatch = useDispatch();
  const quotes = useSelector(selectGigQuotes);
  const quoteId = route.params?.quoteId;
  const quote = findQuote(quotes, quoteId);

  if (!quote) {
    return (
      <View className="flex-1 bg-background">
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View className="px-5 pt-2">
          <ScreenHeader
            title="Provider Profile"
            onBack={() => navigation.goBack()}
          />
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="mb-4 text-center text-sm font-inter text-foreground-muted">
            Provider not found.
          </Text>
          <Text className="mb-6 text-center text-xs font-inter text-foreground-muted">
            The quote may have expired or was not loaded. Go back and open the profile again.
          </Text>
          <Button onPress={() => navigation.goBack()} fullWidth>
            Go back
          </Button>
        </View>
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
          <View className="mb-3">
            <ProviderAvatar
              photo={quote.providerPhoto}
              name={quote.providerName}
              id={quote.id}
              size={84}
            />
          </View>
          <Text className="text-lg font-inter-bold text-foreground">
            {quote.providerName}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Icon name="star" size={14} color={warning} />
            <Text className="text-sm font-inter-medium text-foreground-secondary">
              {quote.rating} · {quote.reviews} reviews
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row justify-around rounded-2xl border border-border bg-card py-4">
          <View className="items-center">
            <Text className="text-sm font-inter-bold text-foreground">
              ${Number(quote.price).toFixed(0)}
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">Quoted price</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm font-inter-bold text-foreground">
              {quote.availability || "—"}
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">Availability</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm font-inter-bold text-foreground">
              {quote.distance || "—"}
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">Distance</Text>
          </View>
        </View>

        {quote.message ? (
          <View className="mb-4 rounded-2xl border border-border bg-card p-4">
            <Text className="mb-1 text-xs font-inter-semibold text-foreground-muted">
              Message
            </Text>
            <Text className="text-sm font-inter italic text-foreground-secondary">
              "{quote.message}"
            </Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground">About</Text>
          <Text className="text-sm font-inter leading-5 text-foreground-secondary">
            {quote.about ||
              `Professional and reliable service provider. ${quote.message || ""} We take pride in our work and customer satisfaction.`}
          </Text>
        </View>

        {quote.services?.length ? (
          <View className="mb-4">
            <Text className="mb-2 text-sm font-inter-semibold text-foreground">
              Services offered
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {quote.services.map((service) => (
                <Badge key={service} label={service} variant="primary" shape="pill" size="sm" />
              ))}
            </View>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground">Previous Work</Text>
          <View className="flex-row gap-3">
            {PORTFOLIO_IMAGES.map((src, i) => (
              <Image
                key={i}
                source={src}
                style={{ flex: 1, aspectRatio: 1, borderRadius: 14 }}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={handleChoose}>Choose This Provider</Button>
      </View>
    </View>
  );
}
