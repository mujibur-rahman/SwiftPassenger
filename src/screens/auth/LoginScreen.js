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
import { useLoginMutation } from "@/features/auth/authApi";
import { userLoggedIn } from "@/features/auth/authSlice";
import AppTextInput from "@/components/ui/AppTextInput";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/ui/AuthHeader";
import Badge from "@/components/ui/Badge";
import Heading from "@/components/ui/Heading";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

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
          <AuthHeader showBack={false} />

          <View className="mb-10 mt-8">
            <Badge
              label="Passenger"
              variant="success"
              uppercase
              className="mb-4"
            />
            
            <Heading
              title="Welcome Back 👋"
              subtitle="Sign in to your account"
              size="lg"
            />
          </View>

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
