// @/screens/main/gig/QuotesReceivedScreen.js
import React from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import QuoteCard from "@/components/gig/QuoteCard";
import { selectGigQuotes } from "@/features/gig/gigSlice";

export default function QuotesReceivedScreen({ navigation }) {
  const { isDark } = useTheme();
  const quotes = useSelector(selectGigQuotes);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Quotes for your job" onBack={() => navigation.goBack()} />
      </View>

      <FlatList
        data={quotes}
        keyExtractor={(q) => q.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-sm font-inter text-foreground-muted">
            No quotes yet.
          </Text>
        }
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            onViewProfile={(quote) =>
              navigation.navigate("ProviderProfile", { quoteId: quote.id })
            }
            onViewQuote={() => navigation.navigate("CompareQuotes")}
          />
        )}
      />
    </View>
  );
}
