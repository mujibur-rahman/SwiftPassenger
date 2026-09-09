// @/screens/main/gig/CompareQuotesScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import ProviderCard from "@/components/gig/ProviderCard";
import { selectGigQuotes, selectQuote } from "@/features/gig/gigSlice";

export default function CompareQuotesScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const quotes = useSelector(selectGigQuotes);
  const selectedQuoteId = useSelector((s) => s.gig.selectedQuoteId);

  const handleChoose = () => {
    if (!selectedQuoteId) return;
    // Always route through the profile so the customer sees full provider
    // details before confirming — CompareQuotesScreen doesn't track whether
    // a profile was already viewed for this quote in this session.
    navigation.navigate("ProviderProfile", { quoteId: selectedQuoteId });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Compare Quotes" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <Text className="mb-3 text-xs font-inter text-foreground-muted">
          Compare price, rating, availability and distance, then pick a provider.
        </Text>

        {quotes.map((quote) => (
          <ProviderCard
            key={quote.id}
            quote={quote}
            selected={selectedQuoteId === quote.id}
            onSelect={(q) => dispatch(selectQuote(q.id))}
          />
        ))}
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={handleChoose} disabled={!selectedQuoteId}>
          Choose Provider
        </Button>
      </View>
    </View>
  );
}
