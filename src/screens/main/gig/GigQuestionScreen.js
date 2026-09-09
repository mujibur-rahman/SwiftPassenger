// @/screens/main/gig/GigQuestionScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import OptionCard from "@/components/gig/OptionCard";
import { getGigService } from "@/config/gigJobs";
import { answerQuestion, selectGigAnswers } from "@/features/gig/gigSlice";

export default function GigQuestionScreen({ route, navigation }) {
  const { serviceId, questionIndex = 0 } = route.params || {};
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const answers = useSelector(selectGigAnswers);

  const service = getGigService(serviceId);
  const question = service?.questions?.[questionIndex];
  const totalQuestions = service?.questions?.length || 0;

  if (!service || !question) {
    // Config missing/out of range — nothing sensible to render.
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="text-center text-sm font-inter text-foreground-muted">
          This gig service isn't available yet.
        </Text>
      </View>
    );
  }

  const handleSelect = (optionId) => {
    dispatch(answerQuestion({ questionId: question.id, optionId }));

    const nextIndex = questionIndex + 1;
    if (nextIndex < totalQuestions) {
      navigation.push("GigQuestion", { serviceId, questionIndex: nextIndex });
    } else {
      navigation.navigate("JobSummary", { serviceId });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader
          title={service.title}
          onBack={() => navigation.goBack()}
        />
        <Text className="mb-1 text-xs font-inter-medium text-foreground-muted">
          Question {questionIndex + 1} of {totalQuestions}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
      >
        <Text className="mb-5 text-xl font-inter-bold text-foreground">{question.question}</Text>

        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            label={option.label}
            selected={answers[question.id] === option.id}
            onPress={() => handleSelect(option.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
