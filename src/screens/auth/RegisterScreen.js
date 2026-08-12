import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRegisterMutation } from "../../features/auth/authApi";
import BrandBadge from "../../components/ui/BrandBadge";
import SvgIcon from "../../components/ui/SvgIcon";
import AppTextInput from "../../components/ui/AppTextInput";
import Button from "../../components/ui/Button";

export default function RegisterScreen({ navigation }) {
  const [register, { isLoading }] = useRegisterMutation();
  const insets = useSafeAreaInsets();

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
          {/* Top row: Back + Brand */}
          <View
            className="absolute left-6 right-6 z-10 flex-row items-center justify-between"
            style={{ top: insets.top }}
          >
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <SvgIcon name="arrowLeft" size={24} color="#38BDF8" />
              <Text className="text-base font-sans-extrabold text-primary">
                Back
              </Text>
            </TouchableOpacity>

            <BrandBadge size={100} />
          </View>

          {/* Header */}
          <View className="mb-8 mt-16">
            <Text className="text-[36px] font-sans-extrabold leading-[44px] text-foreground">
              Create Account
            </Text>
            <Text className="mt-2 text-[15px] font-sans text-foreground-muted">
              Join millions of riders today
            </Text>
          </View>

          {/* Form */}
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
              leftContent="+1"
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
              <Text className="text-center text-[15px] font-sans text-foreground-muted">
                Already have an account?{" "}
                <Text className="font-sans-semibold text-primary">Sign In</Text>
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
