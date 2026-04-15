// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });

  React.useEffect(() => {
    if (error) { Alert.alert('Registration Failed', error); dispatch(clearError()); }
  }, [error]);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const Field = ({ label, field, ...props }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={form[field]} onChangeText={update(field)} placeholderTextColor="#444" selectionColor="#00D95F" {...props} />
    </View>
  );

  return (
    <LinearGradient colors={['#0A0A0A', '#0A0A0A']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Create{'\n'}Account</Text>
            <Text style={styles.subtitle}>Join millions of riders today</Text>
          </View>
          <View style={styles.form}>
            <Field label="Full Name *" field="name" placeholder="John Doe" />
            <Field label="Phone Number *" field="phone" placeholder="+1 (555) 000-0000" keyboardType="phone-pad" />
            <Field label="Email (optional)" field="email" placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" />
            <Field label="Password *" field="password" placeholder="Min 8 characters" secureTextEntry />
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={() => dispatch(registerUser(form))} disabled={loading}>
              <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.btnGrad}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Create Account</Text>}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginAccent}>Sign In</Text></Text>
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
  backBtn: { marginBottom: 32 },
  backText: { color: '#888', fontSize: 16 },
  header: { marginBottom: 32 },
  title: { fontSize: 36, fontWeight: '800', color: '#FFF', lineHeight: 44 },
  subtitle: { color: '#666', fontSize: 15, marginTop: 8 },
  form: { gap: 16 },
  fieldWrap: { gap: 8 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  input: { backgroundColor: '#161616', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', paddingHorizontal: 16, height: 56, color: '#FFF', fontSize: 16 },
  btn: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnGrad: { height: 56, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginText: { color: '#666', fontSize: 15 },
  loginAccent: { color: '#00D95F', fontWeight: '600' },
});
