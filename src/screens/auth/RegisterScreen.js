import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRegisterMutation } from "../../store/auth/authApi";
import BrandBadge from "../../components/ui/BrandBadge";
import SvgIcon from "../../components/ui/SvgIcon";
import AppTextInput from "../../components/ui/AppTextInput";
import { COLORS } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }) {
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

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
    <LinearGradient colors={["#0A0A0A", "#0A0A0A"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.topRow, { top: insets.top }]}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <SvgIcon name="arrowLeft" size={24} color={COLORS.gold} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <BrandBadge size={100} textColor="#FFD700" />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join millions of riders today</Text>
          </View>

          <View style={styles.form}>
            <AppTextInput
              label="Full Name"
              required
              value={form.name}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
              placeholder="John Doe"
            />

            <AppTextInput
              label="Phone Number"
              required
              value={form.phone}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, phone: text }))
              }
              keyboardType="phone-pad"
              placeholder="(555) 000-0000"
              leftContent="+1"
            />

            <AppTextInput
              label="Email (optional)"
              value={form.email}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="john@example.com"
            />

            <AppTextInput
              label="Password"
              required
              value={form.password}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, password: text }))
              }
              placeholder="Min 6 characters"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eyeOff" : "eye"}
              onRightPress={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#00D95F", "#00B84F"]}
                style={styles.btnGrad}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.btnText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginAccent}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 24,
    right: 24,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: { color: "#888", fontSize: 16 },
  header: { marginBottom: 32 },
  title: { fontSize: 36, fontWeight: "800", color: "#FFF", lineHeight: 44 },
  subtitle: { color: "#666", fontSize: 15, marginTop: 8 },
  form: { gap: 14 },
  btn: { borderRadius: 12, overflow: "hidden", marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnGrad: { height: 56, justifyContent: "center", alignItems: "center" },
  btnText: { color: "#000", fontSize: 16, fontWeight: "700" },
  loginLink: { alignItems: "center", marginTop: 16 },
  loginText: { color: "#666", fontSize: 15 },
  loginAccent: { color: "#00D95F", fontWeight: "600" },
});
