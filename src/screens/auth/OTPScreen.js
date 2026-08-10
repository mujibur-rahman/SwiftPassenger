import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../../store/auth/authApi";
import SvgIcon from "../../components/ui/SvgIcon";
import BrandBadge from "../../components/ui/BrandBadge";
import AppTextInput from "../../components/ui/AppTextInput";
import { COLORS } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OTPScreen({ navigation }) {
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("phone");
  const refs = useRef([]);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Enter phone number");
      return;
    }
    try {
      const result = await sendOtp({ phone: phone.trim() }).unwrap();
      console.log();
      setStep("otp");

      // Dev only - remove in production
      if(result?.debugOtp){
        Alert.alert("Dev OTP", result.debugOtp)
        console.log("OTP ->", result.debugOtp); // Metro console
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

  const loading = sending || verifying;

  return (
    <LinearGradient colors={["#0A0A0A", "#0A0A0A"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.topRow, {top: insets.top}]}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <SvgIcon name="arrowLeft" size={24} color={COLORS.gold} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <BrandBadge size={100} textColor="#FFD700" />
          </View>

          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === "phone" ? "Enter Phone Number" : "Verify OTP"}
            </Text>
            <Text style={styles.subtitle}>
              {step === "phone"
                ? "We'll send you a verification code"
                : `Code sent to +1 ${phone}`}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {step === "phone" ? (
              <AppTextInput
                label="Phone Number"
                required
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 000-0000"
                leftContent="+1"
                keyboardType="phone-pad"
              />
            ) : (
              <View style={styles.otpWrap}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => (refs.current[i] = r)}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(v) => handleOTPChange(v, i)}
                    onKeyPress={(e) => handleOTPKeyPress(e, i)}
                    selectionColor="#00D95F"
                    textContentType="oneTimeCode"
                  />
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={step === "phone" ? handleSendOTP : handleVerifyOTP}
              disabled={loading}
            >
              <LinearGradient
                colors={["#00D95F", "#00B84F"]}
                style={styles.btnGrad}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.btnText}>
                    {step === "phone" ? "Send OTP" : "Verify"}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {step === "otp" && (
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={handleSendOTP}
                disabled={sending}
              >
                <Text style={styles.resendText}>
                  Didn't receive code?{" "}
                  <Text style={styles.resendAccent}>Resend</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: 'absolute',
    left: 24,
    right: 24,
  
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    color: "#888",
    fontSize: 16,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 42,
    marginBottom: 10,
  },
  subtitle: {
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  otpWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  otpBox: {
    flex: 1,
    height: 58,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    backgroundColor: "#161616",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
  },
  otpBoxFilled: {
    borderColor: "#00D95F",
  },
  btn: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnGrad: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  resendBtn: {
    alignItems: "center",
    marginTop: 8,
  },
  resendText: {
    color: "#666",
    fontSize: 14,
  },
  resendAccent: {
    color: "#00D95F",
    fontWeight: "600",
  },
});
