import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../../features/auth/authApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SvgIcon from "../../components/ui/SvgIcon";
import BrandBadge from "../../components/ui/BrandBadge";
import AppTextInput from "../../components/ui/AppTextInput";
import Button from "../../components/ui/Button";

export default function OTPScreen({ navigation }) {
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const refs = useRef([]);

  const loading = sending || verifying;

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Enter phone number");
      return;
    }

    try {
      const result = await sendOtp({ phone: phone.trim() }).unwrap();
      setStep("otp");

      // Dev only - remove in production
      if (result?.debugOtp) {
        Alert.alert("Dev OTP", result.debugOtp);
        console.log("OTP ->", result.debugOtp);
      }
    } catch (e) {
      Alert.alert("Error", e?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Error", "Enter complete OTP");
      return;
    }

    try {
      await verifyOtp({ phone: phone.trim(), otp: code }).unwrap();
      // onQueryStarted saves tokens + userLoggedIn
      // RootNavigator switches to Main automatically
    } catch (e) {
      Alert.alert("Error", e?.data?.message || "Invalid OTP");
    }
  };

  const handleOTPChange = (val, idx) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);

    if (digit && idx < 5) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleOTPKeyPress = (e, idx) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
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
          <View className="mb-9 mt-16">
            <Text className="mb-2.5 text-[34px] font-sans-extrabold leading-10.5 text-foreground">
              {step === "phone" ? "Enter Phone Number" : "Verify OTP"}
            </Text>
            <Text className="text-[15px] leading-5.5 font-sans text-foreground-muted">
              {step === "phone"
                ? "We'll send you a verification code"
                : `Code sent to +1 ${phone}`}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {step === "phone" ? (
              <AppTextInput
                label="Phone Number"
                required
                leftContent="+1"
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 000-0000"
                keyboardType="phone-pad"
              />
            ) : (
              <View className="mb-2 flex-row justify-between gap-2">
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => (refs.current[i] = r)}
                    className={`
                      h-14.5 flex-1 rounded-xl border-2
                      text-[22px] font-sans-bold text-foreground
                      bg-input
                      ${digit ? "border-primary" : "border-border"}
                    `}
                    style={{ textAlign: "center" }} // ← use style instead of text-center
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(v) => handleOTPChange(v, i)}
                    onKeyPress={(e) => handleOTPKeyPress(e, i)}
                    selectionColor="#38BDF8"
                    cursorColor="#38BDF8"
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                  />
                ))}
              </View>
            )}

            <Button
              variant="primary"
              onPress={step === "phone" ? handleSendOTP : handleVerifyOTP}
              loading={loading}
              disabled={loading}
              className="mt-2"
            >
              {step === "phone" ? "Send OTP" : "Verify"}
            </Button>

            {step === "otp" && (
              <TouchableOpacity
                className="mt-2 items-center"
                onPress={handleSendOTP}
                disabled={sending}
                activeOpacity={0.7}
              >
                <Text className="text-sm font-sans text-foreground-muted">
                  Didn't receive code?{" "}
                  <Text className="font-sans-semibold text-primary">
                    Resend
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
