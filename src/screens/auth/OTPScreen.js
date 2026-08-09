// src/screens/auth/OTPScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../store/auth/authApi';
// import { useSendOtpMutation, useVerifyOtpMutation } from '../../store/api';

export default function OTPScreen({ navigation }) {
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone');
  const refs = useRef([]);

  const handleSendOTP = async () => {
    if (!phone) {
      Alert.alert('Error', 'Enter phone number');
      return;
    }
    try {
      await sendOtp({ phone }).unwrap();
      setStep('otp');
    } catch (e) {
      Alert.alert('Error', e?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Error', 'Enter complete OTP');
      return;
    }
    try {
      await verifyOtp({ phone, otp: code }).unwrap();
      // authSlice matcher will set isAuthenticated → RootNavigator switches
    } catch (e) {
      Alert.alert('Error', e?.data?.message || 'Invalid OTP');
    }
  };

  const handleOTPChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
    if (!val && idx > 0) refs.current[idx - 1]?.focus();
  };

  const loading = sending || verifying;

  return (
    <LinearGradient colors={['#0A0A0A', '#0A0A0A']} style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{step === 'phone' ? 'Enter Phone\nNumber' : 'Verify OTP'}</Text>
      <Text style={styles.subtitle}>{step === 'phone' ? "We'll send you a verification code" : `Code sent to ${phone}`}</Text>

      {step === 'phone' ? (
        <View style={styles.phoneWrap}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.phoneInput} placeholder="+1 (555) 000-0000" placeholderTextColor="#444" keyboardType="phone-pad" value={phone} onChangeText={setPhone} selectionColor="#00D95F" />
        </View>
      ) : (
        <View style={styles.otpWrap}>
          {otp.map((digit, i) => (
            <TextInput key={i} ref={(r) => (refs.current[i] = r)} style={[styles.otpBox, digit && styles.otpBoxFilled]} maxLength={1} keyboardType="number-pad" value={digit} onChangeText={(v) => handleOTPChange(v, i)} selectionColor="#00D95F" />
          ))}
        </View>
      )}

      {/* <TouchableOpacity style={styles.btn} onPress={step === 'phone' ? sendOTP : verifyOTP} disabled={loading}>
        <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.btnGrad}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>{step === 'phone' ? 'Send OTP' : 'Verify'}</Text>}
        </LinearGradient>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.btn}
        onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
        disabled={loading}
      >
        <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.btnGrad}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>{step === 'phone' ? 'Send OTP' : 'Verify'}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  back: { marginBottom: 40 },
  backText: { color: '#888', fontSize: 16 },
  title: { fontSize: 36, fontWeight: '800', color: '#FFF', lineHeight: 44, marginBottom: 8 },
  subtitle: { color: '#666', fontSize: 15, marginBottom: 40 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  phoneWrap: { marginBottom: 24 },
  phoneInput: { backgroundColor: '#161616', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', paddingHorizontal: 16, height: 56, color: '#FFF', fontSize: 16 },
  otpWrap: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpBox: { flex: 1, height: 60, borderRadius: 12, borderWidth: 2, borderColor: '#2A2A2A', backgroundColor: '#161616', textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#FFF' },
  otpBoxFilled: { borderColor: '#00D95F' },
  btn: { borderRadius: 12, overflow: 'hidden' },
  btnGrad: { height: 56, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
