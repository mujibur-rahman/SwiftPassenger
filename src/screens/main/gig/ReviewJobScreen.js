// @/screens/main/gig/ReviewJobScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { getGigService } from "@/config/gigJobs";
import { postJob, selectGig } from "@/features/gig/gigSlice";
// import { usePostGigJobMutation } from "@/features/gig/gigApi"; // wire in once backend is ready

function humanizeId(id = "") {
  const withSpaces = id.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function ReviewRow({ label, value, onPress, isLast }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between py-3 ${!isLast ? "border-b border-border" : ""}`}
    >
      <View className="flex-1 pr-3">
        <Text className="text-xs font-inter-medium text-foreground-muted">{label}</Text>
        <Text className="mt-0.5 text-sm font-inter-semibold text-foreground">{value || "—"}</Text>
      </View>
      <Icon name="pencil-outline" size={16} color="#7DD3FC" />
    </TouchableOpacity>
  );
}

export default function ReviewJobScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const serviceId = route.params?.serviceId || gig.serviceId;
  const service = getGigService(serviceId);
  // const [postGigJob] = usePostGigJobMutation();

  const answerRows = (service?.questions || []).map((question, index) => {
    const optionId = gig.answers[question.id];
    const option = question.options.find((o) => o.id === optionId);
    return {
      label: humanizeId(question.id),
      value: option?.label,
      onPress: () => navigation.navigate("GigQuestion", { serviceId, questionIndex: index }),
    };
  });

  const contact = gig.contact || {};
  const location = [contact.address, contact.suburb, contact.postcode].filter(Boolean).join(", ");

  const handlePost = () => {
    dispatch(postJob());
    // postGigJob(gig.job) — enable once /gig/jobs is live
    navigation.navigate("JobPosted");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Review Job" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <Text className="mb-2 text-xl font-inter-bold text-foreground">{service?.title}</Text>

        <View className="mb-4 rounded-2xl border border-border bg-card px-4">
          {answerRows.map((row, i) => (
            <ReviewRow key={row.label} {...row} isLast={i === answerRows.length - 1} />
          ))}
        </View>

        <View className="rounded-2xl border border-border bg-card px-4">
          <ReviewRow
            label="Location"
            value={location}
            onPress={() => navigation.navigate("ContactDetails", { serviceId })}
            isLast
          />
        </View>
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={handlePost}>Post My Job</Button>
      </View>
    </View>
  );
}
