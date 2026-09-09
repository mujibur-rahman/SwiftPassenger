// @/screens/main/gig/GigQuestionScreen.js
// একই স্ক্রিনে পুরো প্রশ্নের ফ্লো — প্রতিটি প্রশ্নের জন্য আলাদা screen push করা হয় না।
// শুধু local `stepIndex` state দিয়ে প্রশ্ন পরিবর্তন হয়, answers Redux-এ persist থাকে,
// তাই ReviewJobScreen থেকে নির্দিষ্ট questionIndex দিয়ে এডিট করতে এলেও একই প্যাটার্ন কাজ করে।
import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, StatusBar, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ImageOptionCard from "@/components/gig/ImageOptionCard";
import { getGigService } from "@/config/gigJobs";
import { answerQuestion, selectGigAnswers } from "@/features/gig/gigSlice";

export default function GigQuestionScreen({ route, navigation }) {
  const { serviceId, questionIndex: initialIndex = 0 } = route.params || {};
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const answers = useSelector(selectGigAnswers);
  const service = getGigService(serviceId);

  const [stepIndex, setStepIndex] = useState(initialIndex);
  const fade = useRef(new Animated.Value(1)).current;

  const totalQuestions = service?.questions?.length || 0;
  const question = service?.questions?.[stepIndex];

  // প্রশ্ন পরিবর্তনের সময় ছোট্ট fade-in — স্ক্রিন না বদলেও ধাপে ধাপে
  // এগোনোর অনুভূতিটা থাকে।
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, fade]);

  if (!service || !question) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="text-center text-sm font-inter text-foreground-muted">
          This gig service isn't available yet.
        </Text>
      </View>
    );
  }

  const goBackOneStep = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSelect = (optionId) => {
    dispatch(answerQuestion({ questionId: question.id, optionId }));

    const nextIndex = stepIndex + 1;
    if (nextIndex < totalQuestions) {
      // সিলেকশনটা এক মুহূর্ত দেখিয়ে তারপর পরের প্রশ্নে — same-screen ট্রানজিশন
      setTimeout(() => setStepIndex(nextIndex), 180);
    } else {
      navigation.navigate("JobSummary", { serviceId });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title={service.title} onBack={goBackOneStep} />

        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-xs font-inter-medium text-foreground-muted">
            Question {stepIndex + 1} of {totalQuestions}
          </Text>
        </View>
        <View className="h-1 overflow-hidden rounded-full bg-background-muted">
          <View
            className="h-full rounded-full"
            style={{
              width: `${((stepIndex + 1) / totalQuestions) * 100}%`,
              backgroundColor: primary,
            }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
      >
        <Animated.View style={{ opacity: fade }}>
          <Text className="mb-5 text-xl font-inter-bold text-foreground">{question.question}</Text>

          <View className="flex-row flex-wrap justify-between">
            {question.options.map((option) => (
              <ImageOptionCard
                key={option.id}
                image={option.image}
                icon={option.icon}
                color={option.color}
                title={option.title || option.label}
                subtitle={option.subtitle}
                aspectRatio={question.imageAspectRatio || 1.3}
                selected={answers[question.id] === option.id}
                onPress={() => handleSelect(option.id)}
                style={{ width: "48%", marginBottom: 14 }}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
