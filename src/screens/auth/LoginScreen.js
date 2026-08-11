// src/screens/auth/LoginScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../store/auth/authApi";
import { userLoggedIn } from "../../store/auth/authSlice";
import BrandBadge from "../../components/ui/BrandBadge";
import AppTextInput from "../../components/ui/AppTextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // 1. Call RTK Query mutation
      const result = await login({ phone, password }).unwrap();

      console.log("Login success →", result);

      const token = result.accessToken || result.token;

      // 2. Save token & user
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(result.user));

      console.log("AsyncStorage saved");

      // 3. Update Redux auth state
      dispatch(
        userLoggedIn({
          accessToken: token,
          user: result.user,
        }),
      );

      console.log("Redux updated");
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
    <LinearGradient colors={["#0A0A0A", "#0A0A0A"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="grow justify-center p-6">
          {/* Brand Badge */}
          <BrandBadge
            style={{
              position: "absolute",
              right: 16,
              top: Math.max(insets.top),
            }}
            size={100}
            textColor="#FFD700"
          />

          {/* Header */}
          <View className="mb-10">
            <View className="self-start mb-4 rounded bg-[#00D95F]/12.5 border border-[#00D95F]/25 px-2.5 py-1">
              <Text className="text-[10px] font-bold tracking-[1.5px] text-success">
                PASSENGER
              </Text>
            </View>

            <Text className="text-3xl font-sans-extrabold text-foreground">
              Welcome Back 👋
            </Text>

            <Text className="mt-2 text-base text-muted-foreground">
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <AppTextInput
              label="Phone Number"
              required
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              leftContent="+1"
              keyboardType="phone-pad"
            />

            <AppTextInput
              label="Password"
              required
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eyeOff" : "eye"}
              onRightPress={() => setShowPassword(!showPassword)}
            />

            {/* Login Button */}
            <TouchableOpacity
              className="mt-2 overflow-hidden rounded-xl"
              style={{ opacity: isLoading ? 0.7 : 1 }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#00D95F", "#00B84F"]}
                className="h-14 items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text className="text-base font-sans-bold tracking-[0.5px] text-black">
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* OTP Button */}
            <TouchableOpacity
              className="h-14 items-center justify-center rounded-xl border border-border"
              onPress={() => navigation.navigate("OTP")}
            >
              <Text className="text-[15px] font-sans-medium text-foreground">
                📱 Continue with OTP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register */}
          <TouchableOpacity
            className="mt-8 items-center"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-[15px] text-[#666666]">
              Don't have an account?{" "}
              <Text className="font-sans-semibold text-success">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
