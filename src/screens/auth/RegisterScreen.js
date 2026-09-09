import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRegisterMutation } from "@/features/auth/authApi";
import AppTextInput from "@/components/ui/AppTextInput";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/ui/AuthHeader";
import Heading from "@/components/ui/Heading";

export default function RegisterScreen({ navigation }) {
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.phone || !form.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await register(form).unwrap();
      // onQueryStarted already saves token + dispatches userLoggedIn
      // RootNavigator will automatically switch to Main
    } catch (err) {
      Alert.alert(
        "Registration Failed",
        err?.data?.message || err?.error || "Something went wrong",
      );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader />

          <Heading
            title="Create Account"
            subtitle="Join millions of riders today"
            size="lg"
            className="mb-8 mt-16"
          />

          <View className="gap-3.5">
            <AppTextInput
              label="Full Name"
              leftIcon="user"
              required
              value={form.name}
              onChangeText={(text) => updateForm("name", text)}
              placeholder="John Doe"
              autoCapitalize="words"
            />

            <AppTextInput
              label="Phone Number"
              required
              leftContent="+61"
              value={form.phone}
              onChangeText={(text) => updateForm("phone", text)}
              keyboardType="phone-pad"
              placeholder="(555) 000-0000"
            />

            <AppTextInput
              label="Email (optional)"
              leftIcon="mail"
              value={form.email}
              onChangeText={(text) => updateForm("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="john@example.com"
            />

            <AppTextInput
              label="Password"
              leftIcon="lock"
              required
              secureTextEntry
              value={form.password}
              onChangeText={(text) => updateForm("password", text)}
              placeholder="Min 6 characters"
            />

            <Button
              variant="primary"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              className="mt-2"
            >
              Create Account
            </Button>

            <Button
              variant="link"
              size="sm"
              className="mt-6"
              onPress={() => navigation.navigate("Login")}
            >
              <Text className="text-center text-base font-inter text-foreground-muted">
                Already have an account?{" "}
                <Text className="font-inter-semibold text-primary">Sign In</Text>
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
