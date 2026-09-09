// @/screens/main/gig/GigCategoriesScreen.js
import React from "react";
import { View, ScrollView, StatusBar, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import GigCategoryCard from "@/components/gig/GigCategoryCard";
import { GIG_CATEGORIES, getGigService } from "@/config/gigJobs";
import { startGigJob } from "@/features/gig/gigSlice";

export default function GigCategoriesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  const handleSelect = (category) => {
    // Categories without a question-flow config yet fall back to "Coming soon",
    // same behaviour ServiceCard uses for unbuilt services.
    if (!getGigService(category.id)) {
      Alert.alert("Coming soon", `${category.title} is coming soon`);
      return;
    }
    dispatch(startGigJob(category.id));
    navigation.navigate("GigQuestion", { serviceId: category.id, questionIndex: 0 });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Gig Jobs" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <View className="service-grid">
          {GIG_CATEGORIES.map((category) => (
            <GigCategoryCard key={category.id} category={category} onPress={handleSelect} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
