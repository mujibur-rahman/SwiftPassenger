// @/screens/main/gig/ContactDetailsScreen.js
import React, { useState } from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import ContactDetailsForm from "@/components/gig/ContactDetailsForm";
import { setContact, selectGig } from "@/features/gig/gigSlice";

const REQUIRED_FIELDS = ["fullName", "mobile", "email", "address", "suburb", "postcode"];

export default function ContactDetailsScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const serviceId = route.params?.serviceId || gig.serviceId;

  const [values, setValues] = useState(gig.contact || {});
  const [errors, setErrors] = useState({});

  const handleContinue = () => {
    const nextErrors = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!values[key]?.trim()) nextErrors[key] = "Required";
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    dispatch(setContact(values));
    navigation.navigate("ReviewJob", { serviceId });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Contact Details" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <ContactDetailsForm values={values} onChange={setValues} errors={errors} />
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={handleContinue}>Continue</Button>
      </View>
    </View>
  );
}
