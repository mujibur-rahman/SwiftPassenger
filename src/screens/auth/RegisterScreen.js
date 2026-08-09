// src/screens/auth/RegisterScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/slices/authSlice";
import BrandBadge from "../../components/ui/BrandBadge";
import SvgIcon from "../../components/ui/SvgIcon";
import { COLORS } from "../../constants/Colors";
import AppTextInput from "../../components/ui/AppTextInput";

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Registration Failed", error);
      dispatch(clearError());
    }
  }, [error]);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleRegister = () => {
    if (!form.name || !form.phone || !form.password || !form.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    dispatch(registerUser(form));
  };

  // const Field = ({ label, field, ...props }) => (
  //   <View style={styles.fieldWrap}>
  //     <Text style={styles.label}>{label}</Text>
  //     <TextInput style={styles.input} value={form[field]} onChangeText={update(field)} placeholderTextColor="#444" selectionColor="#00D95F" {...props} />
  //   </View>
  // );

  const Field = ({ label, field, required, ...props }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {label}
        {required && " *"}
      </Text>
      <TextInput
        style={styles.input}
        value={form[field]}
        onChangeText={update(field)}
        placeholderTextColor="#444"
        selectionColor="#FF6B35"
        {...props}
      />
    </View>
  );

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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <SvgIcon name="arrowLeft" size={24} color={COLORS.gold} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <BrandBadge
            style={{ position: "absolute", right: 16, top: 12 }}
            size={100}
            textColor="#FFD700"
          />
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
              placeholder="+1 (555) 000-0000"
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
              placeholder="Min 8 characters"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eyeOff" : "eye"}
              onRightPress={() => setShowPassword(!showPassword)}
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={["#00D95F", "#00B84F"]}
                style={styles.btnGrad}
              >
                {loading ? (
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
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 50,
  },
  backText: { color: "#888", fontSize: 16 },
  header: { marginBottom: 32 },
  title: { fontSize: 36, fontWeight: "800", color: "#FFF", lineHeight: 44 },
  subtitle: { color: "#666", fontSize: 15, marginTop: 8 },
  form: { gap: 14 },
  fieldWrap: { gap: 6 },
  label: { color: "#888", fontSize: 12, fontWeight: "600", letterSpacing: 0.5 },
  input: {
    backgroundColor: "#161616",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 16,
    height: 52,
    color: "#FFF",
    fontSize: 15,
  },
  btn: { borderRadius: 12, overflow: "hidden", marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnGrad: { height: 56, justifyContent: "center", alignItems: "center" },
  btnText: { color: "#000", fontSize: 16, fontWeight: "700" },
  loginLink: { alignItems: "center", marginTop: 16 },
  loginText: { color: "#666", fontSize: 15 },
  loginAccent: { color: "#00D95F", fontWeight: "600" },
});
