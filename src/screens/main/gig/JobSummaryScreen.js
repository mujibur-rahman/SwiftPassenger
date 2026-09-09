// @/screens/main/gig/JobSummaryScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import JobSummaryCard from "@/components/gig/JobSummaryCard";
import { selectGig } from "@/features/gig/gigSlice";

const NEXT_STEPS = [
  "Add your contact details",
  "Review your job",
  "Post your job",
  "Receive quotes from available providers",
];

export default function JobSummaryScreen({ route, navigation }) {
  const { isDark, colors } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const gig = useSelector(selectGig);
  const serviceId = route.params?.serviceId || gig.serviceId;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Job Summary" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <JobSummaryCard serviceId={serviceId} answers={gig.answers} className="mb-6" />

        <Text className="mb-3 text-base font-inter-bold text-foreground">
          Your job's ready. Here's what happens next:
        </Text>

        <View className="mb-8 gap-3">
          {NEXT_STEPS.map((step, i) => (
            <View key={step} className="flex-row items-center gap-3">
              <View className="h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                <Text className="text-xs font-inter-bold text-primary">{i + 1}</Text>
              </View>
              <Text className="flex-1 text-sm font-inter text-foreground-secondary">{step}</Text>
              <Icon name="chevron-right" size={16} color={primary} style={{ opacity: 0.5 }} />
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={() => navigation.navigate("ContactDetails", { serviceId })}>
          Add Contact Details
        </Button>
      </View>
    </View>
  );
}
