// src/screens/main/NotificationsScreen.js
// Works for both passenger and driver apps (colour changes via props)
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const ACCENT = '#00D95F'; // change to '#FF6B35' for driver app

const NOTIFICATION_GROUPS = [
  {
    title: 'Ride Updates',
    items: [
      { id: 'ride_request',   label: 'Ride Requests',        sub: 'New ride available nearby',          default: true },
      { id: 'ride_status',    label: 'Ride Status Changes',  sub: 'Driver accepted, arrived, started',  default: true },
      { id: 'ride_completed', label: 'Ride Completed',       sub: 'Trip summary and receipt',           default: true },
    ],
  },
  {
    title: 'Payments',
    items: [
      { id: 'payment',        label: 'Payment Confirmation', sub: 'When a payment is processed',        default: true },
      { id: 'promo',          label: 'Promos & Offers',      sub: 'Discounts and special offers',       default: false },
      { id: 'earnings',       label: 'Earnings Summary',     sub: 'Daily and weekly earnings reports',  default: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'security',       label: 'Security Alerts',      sub: 'Login attempts and account changes', default: true },
      { id: 'updates',        label: 'App Updates',          sub: 'New features and improvements',      default: false },
      { id: 'support',        label: 'Support Messages',     sub: 'Replies from our support team',      default: true },
    ],
  },
];

export default function NotificationsScreen({ navigation }) {
  const initialState = {};
  NOTIFICATION_GROUPS.forEach((g) => g.items.forEach((i) => { initialState[i.id] = i.default; }));
  const [settings, setSettings] = useState(initialState);
  const [masterEnabled, setMasterEnabled] = useState(true);

  const toggle = (id) => setSettings((s) => ({ ...s, [id]: !s[id] }));

  const enabledCount = Object.values(settings).filter(Boolean).length;
  const totalCount   = Object.values(settings).length;

  return (
    <LinearGradient colors={['#0A0A0A', '#0A0A0A']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Master toggle */}
        <View style={styles.masterCard}>
          <View style={styles.masterIcon}>
            <Icon name="bell-outline" size={24} color={ACCENT} />
          </View>
          <View style={styles.masterInfo}>
            <Text style={styles.masterLabel}>All Notifications</Text>
            <Text style={styles.masterSub}>{enabledCount}/{totalCount} types enabled</Text>
          </View>
          <Switch
            value={masterEnabled}
            onValueChange={(v) => {
              setMasterEnabled(v);
              const all = {};
              NOTIFICATION_GROUPS.forEach((g) => g.items.forEach((i) => { all[i.id] = v; }));
              setSettings(all);
            }}
            trackColor={{ false: '#333', true: `${ACCENT}80` }}
            thumbColor={masterEnabled ? ACCENT : '#555'}
          />
        </View>

        {/* Notification groups */}
        {NOTIFICATION_GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, idx) => (
                <View
                  key={item.id}
                  style={[styles.notifItem, idx < group.items.length - 1 && styles.notifItemBorder]}
                >
                  <View style={styles.notifInfo}>
                    <Text style={[styles.notifLabel, !masterEnabled && styles.notifLabelDisabled]}>
                      {item.label}
                    </Text>
                    <Text style={styles.notifSub}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={settings[item.id] && masterEnabled}
                    onValueChange={() => toggle(item.id)}
                    disabled={!masterEnabled}
                    trackColor={{ false: '#333', true: `${ACCENT}80` }}
                    thumbColor={settings[item.id] && masterEnabled ? ACCENT : '#555'}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.note}>
          Notification preferences are saved locally. Push notifications require app permissions.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  masterCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#111', borderRadius: 16, padding: 18,
    marginBottom: 24, borderWidth: 1, borderColor: '#1E1E1E',
  },
  masterIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: `${ACCENT}15`, justifyContent: 'center', alignItems: 'center',
  },
  masterInfo: { flex: 1 },
  masterLabel: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  masterSub:   { color: '#666', fontSize: 12, marginTop: 2 },
  group: { marginBottom: 16 },
  groupTitle: {
    color: '#555', fontSize: 12, fontWeight: '600',
    letterSpacing: 0.5, marginBottom: 8, marginLeft: 4,
  },
  groupCard: {
    backgroundColor: '#111', borderRadius: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: '#1E1E1E',
  },
  notifItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  notifItemBorder: { borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  notifInfo: { flex: 1 },
  notifLabel: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  notifLabelDisabled: { color: '#555' },
  notifSub: { color: '#666', fontSize: 12, marginTop: 2 },
  note: { color: '#444', fontSize: 12, textAlign: 'center', marginTop: 8, lineHeight: 18 },
});
