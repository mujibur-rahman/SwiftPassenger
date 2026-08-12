// src/screens/main/DriverProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logoutDriver } from '../../store/slices/authSlice';
import { useDriverSocket } from '../../services/DriverSocketContext';

const MenuItem = ({ icon, label, value, onPress, danger, badge }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Icon name={icon} size={20} color={danger ? '#FF4444' : '#FF6B35'} />
    </View>
    <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
    <View style={styles.menuRight}>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      <Icon name="chevron-right" size={18} color="#444" />
    </View>
  </TouchableOpacity>
);

export default function DriverProfileScreen() {
  const dispatch = useDispatch();
  const { driver } = useSelector((s) => s.auth);
  const { disconnect } = useDriverSocket();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { disconnect(); dispatch(logoutDriver()); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={['#150E0A', '#060E1A']} style={styles.headerGrad}>
        <View style={styles.avatarWrap}>
          <LinearGradient colors={['#FF6B35', '#E55A25']} style={styles.avatar}>
            <Text style={styles.avatarText}>{driver?.name?.[0] || 'D'}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.driverName}>{driver?.name || 'Driver'}</Text>
        <Text style={styles.driverPhone}>{driver?.phone}</Text>
        <View style={styles.metricsRow}>
          {[
            { label: 'Rating', value: `⭐ ${driver?.rating || '4.92'}` },
            { label: 'Trips', value: driver?.totalTrips || '1,234' },
            { label: 'Acceptance', value: `${driver?.acceptanceRate || 94}%` },
          ].map((m) => (
            <View key={m.label} style={styles.metric}>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {driver?.vehicle && (
        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleEmoji}>🚗</Text>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}</Text>
            <Text style={styles.vehiclePlate}>{driver.vehicle.plate} · {driver.vehicle.color}</Text>
          </View>
        </View>
      )}

      {[
        { title: 'Account', items: [
          { icon: 'account-edit-outline', label: 'Edit Profile' },
          { icon: 'car-outline', label: 'Vehicle Details' },
          { icon: 'file-document-outline', label: 'Documents', badge: '2 pending' },
          { icon: 'bank-outline', label: 'Payout Settings' },
        ]},
        { title: 'Support', items: [
          { icon: 'help-circle-outline', label: 'Driver Help Center' },
          { icon: 'chat-outline', label: 'Contact Support' },
        ]},
      ].map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item) => <MenuItem key={item.label} {...item} />)}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <View style={styles.menuCard}>
          <MenuItem icon="logout" label="Sign Out" danger onPress={handleLogout} />
        </View>
      </View>
      <Text style={styles.version}>SwiftDrive v1.0.0 · Driver Edition</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060E1A' },
  scroll: { paddingBottom: 40 },
  headerGrad: { padding: 24, paddingTop: 60, alignItems: 'center', gap: 4 },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: 32 },
  driverName: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  driverPhone: { color: '#666', fontSize: 14 },
  metricsRow: { flexDirection: 'row', gap: 40, marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  metric: { alignItems: 'center', gap: 2 },
  metricValue: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  metricLabel: { color: '#666', fontSize: 11 },
  vehicleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 16, backgroundColor: '#111', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1E1E' },
  vehicleEmoji: { fontSize: 32 },
  vehicleInfo: { flex: 1 },
  vehicleName: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  vehiclePlate: { color: '#888', fontSize: 13, marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { color: '#555', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  menuCard: { backgroundColor: '#111', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1E1E1E' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FF6B3515', justifyContent: 'center', alignItems: 'center' },
  menuIconDanger: { backgroundColor: '#FF444415' },
  menuLabel: { flex: 1, color: '#FFF', fontSize: 15 },
  menuLabelDanger: { color: '#FF4444' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { color: '#666', fontSize: 13 },
  badge: { backgroundColor: '#FF6B3520', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#FF6B35', fontSize: 11, fontWeight: '600' },
  version: { color: '#333', fontSize: 12, textAlign: 'center', marginTop: 16 },
});
