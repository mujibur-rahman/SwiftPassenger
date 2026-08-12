// src/screens/main/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { updateUserProfile } from '../../store/slices/authSlice';

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [name,     setName]     = useState(user?.name  || '');
  const [email,    setEmail]    = useState(user?.email || '');
  const [loading,  setLoading]  = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    setLoading(true);
    try {
      const res = await api.patch('/passengers/me', { name, email });
      dispatch(updateUserProfile({ name, email }));
      Alert.alert('Success', 'Profile updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#060E1A', '#060E1A']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.avatar}>
              <Text style={styles.avatarText}>{name?.[0]?.toUpperCase() || 'R'}</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#444"
                selectionColor="#00D95F"
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Email (optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#444"
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor="#00D95F"
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledText}>{user?.phone}</Text>
                <View style={styles.lockedBadge}>
                  <Icon name="lock" size={12} color="#888" />
                  <Text style={styles.lockedText}>Locked</Text>
                </View>
              </View>
              <Text style={styles.hint}>Phone number cannot be changed</Text>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.saveBtnGrad}>
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.saveBtnText}>Save Changes</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 32,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  avatarSection: { alignItems: 'center', marginBottom: 36, gap: 12 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#000', fontWeight: '800', fontSize: 36 },
  changePhotoBtn: {
    backgroundColor: '#1A1A1A', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6,
    borderWidth: 1, borderColor: '#1E3A5F',
  },
  changePhotoText: { color: '#00D95F', fontSize: 14, fontWeight: '500' },
  form: { gap: 20, marginBottom: 32 },
  fieldWrap: { gap: 8 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#161616', borderRadius: 12, borderWidth: 1,
    borderColor: '#1E3A5F', paddingHorizontal: 16, height: 56,
    color: '#FFF', fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#111', borderRadius: 12, borderWidth: 1,
    borderColor: '#1E1E1E', paddingHorizontal: 16, height: 56,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  disabledText: { color: '#555', fontSize: 16 },
  lockedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1A1A1A', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  lockedText: { color: '#888', fontSize: 11 },
  hint: { color: '#444', fontSize: 12 },
  saveBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnGrad: { height: 56, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  cancelBtn: {
    height: 52, borderRadius: 14, borderWidth: 1,
    borderColor: '#1E3A5F', justifyContent: 'center', alignItems: 'center',
  },
  cancelBtnText: { color: '#666', fontSize: 15 },
});
