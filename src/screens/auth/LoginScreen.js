// src/screens/auth/LoginScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoginMutation } from "@/features/auth/authApi";
import { userLoggedIn } from "@/features/auth/authSlice";
import BrandBadge from "@/components/ui/BrandBadge";
import AppTextInput from "@/components/ui/AppTextInput";
import Button from "@/components/ui/Button";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await login({ phone, password }).unwrap();
      const token = result.accessToken || result.token;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(result.user));

      dispatch(
        userLoggedIn({
          accessToken: token,
          user: result.user,
        }),
      );
    } catch (err) {
      console.log("Login error →", JSON.stringify(err, null, 2));

      Alert.alert(
        "Login Failed",
        err?.data?.message ||
          err?.error ||
          "Network error. Check server & BASE_URL",
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
          {/* Brand Badge */}
          <View className="absolute right-4 z-10" style={{ top: insets.top }}>
            <BrandBadge size={100} />
          </View>

          {/* Header */}
          <View className="mb-10 mt-8">
            <View className="mb-4 self-start rounded-md border border-success/25 bg-success/10 px-2.5 py-1">
              <Text className="text-[10px] font-sans-bold tracking-[1.5px] text-success">
                PASSENGER
              </Text>
            </View>

            <Text className="h1">Welcome Back 👋</Text>

            <Text className="sub mt-2">Sign in to your account</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <AppTextInput
              label="Phone Number"
              required
              leftContent="+1"
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              keyboardType="phone-pad"
            />

            <AppTextInput
              label="Password"
              rightLabel="Forgot?"
              onRightLabelPress={() => navigation.navigate("ForgotPassword")}
              required
              leftIcon="lock"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
            />

            <Button
              variant="primary"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              className="mt-1"
            >
              Sign In
            </Button>

            <Button
              variant="outline"
              onPress={() => navigation.navigate("OTP")}
              disabled={isLoading}
            >
              Continue with OTP
            </Button>
          </View>

          {/* Footer link */}
          <Button
            variant="link"
            size="sm"
            className="mt-8"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-center text-[15px] font-sans text-foreground-muted">
              Don't have an account?{" "}
              <Text className="font-sans-semibold text-primary">Sign Up</Text>
            </Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
