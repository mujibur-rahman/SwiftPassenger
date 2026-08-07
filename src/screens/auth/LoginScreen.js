// src/screens/auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';

import {
  useFonts,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import { COLORS } from '../../constants/Colors';
import BrandBadge from '../../components/ui/BrandBadge';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) { Alert.alert('Login Failed', error); dispatch(clearError()); }
  }, [error]);

  const handleLogin = () => {
    if (!phone || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    dispatch(loginUser({ phone, password }));
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#0A0A0A']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <BrandBadge style={{ position: 'absolute', right: 16, top: 12 }} size={100} textColor="#FFD700" />

          <View style={styles.header}>
            <View style={styles.badge}><Text style={styles.badgeText}>PASSENGER</Text></View>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.prefix}>+1</Text>
                <TextInput style={styles.input} placeholder="(555) 000-0000" placeholderTextColor="#888" keyboardType="phone-pad" value={phone} onChangeText={setPhone} selectionColor="#00D95F" />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={[styles.inputWrap, styles.inputDirect]} placeholder="Enter password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} selectionColor="#00D95F" />
            </View>
            <TouchableOpacity style={[styles.loginBtn, loading && styles.loginBtnDisabled]} onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.loginGrad}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginText}>Sign In</Text>}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneBtn} onPress={() => navigation.navigate('OTP')}>
              <Text style={styles.phoneBtnText}>📱  Continue with OTP</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerAccent}>Sign Up</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 40 },
  badge: { backgroundColor: '#00D95F20', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 16, borderWidth: 1, borderColor: '#00D95F40' },
  badgeText: { color: '#00D95F', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  title: { flexDirection: 'row', fontSize: 30, fontWeight: '800', color: '#FFF', lineHeight: 48 },
  subtitle: { color: COLORS.subText, fontSize: 16, marginTop: 8 },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { color: COLORS.subText, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', paddingHorizontal: 16, height: 56 },
  prefix: { color: COLORS.subText, fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  inputDirect: { color: '#FFF', fontSize: 16 },
  loginBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  loginBtnDisabled: { opacity: 0.7 },
  loginGrad: { height: 56, justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#000', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  phoneBtn: { height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', justifyContent: 'center', alignItems: 'center' },
  phoneBtnText: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  registerLink: { marginTop: 32, alignItems: 'center' },
  registerText: { color: '#666', fontSize: 15 },
  registerAccent: { color: '#00D95F', fontWeight: '600' },
});
