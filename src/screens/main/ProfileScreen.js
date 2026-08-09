// src/screens/main/ProfileScreen.js  (Passenger - FINAL)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '../../store/slices/authSlice';
import { useSocket } from '../../services/SocketContext';
import { logout } from '../../store/auth/authSlice';

const MenuItem = ({ icon, label, value, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Icon name={icon} size={20} color={danger ? '#FF4444' : '#00D95F'} />
    </View>
    <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
    <View style={styles.menuRight}>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      <Icon name="chevron-right" size={18} color="#444" />
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const dispatch      = useDispatch();
  const { user }      = useSelector((s) => s.auth);
  const { history }   = useSelector((s) => s.ride);
  const { disconnect } = useSocket();

  const handleLogout = () =>
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { disconnect(); dispatch(logout()); } },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={['#0D1B0F', '#0A0A0A']} style={styles.headerGrad}>
        <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.8}>
          <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'R'}</Text>
          </LinearGradient>
          <View style={styles.editBadge}><Icon name="pencil" size={10} color="#FFF" /></View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.name || 'Rider'}</Text>
        <Text style={styles.userPhone}>{user?.phone}</Text>
        {user?.email ? <Text style={styles.userEmail}>{user.email}</Text> : null}
        <View style={styles.statsRow}>
          {[{ label: 'Trips', value: history?.length || 0 }, { label: 'Rating', value: user?.rating || '5.0' }].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="account-edit-outline" label="Edit Profile"       onPress={() => navigation.navigate('EditProfile')} />
          <MenuItem icon="phone-outline"        label="Phone"              value={user?.phone} />
          <MenuItem icon="email-outline"        label="Email"              value={user?.email || 'Not set'} onPress={() => navigation.navigate('EditProfile')} />
          <MenuItem icon="shield-lock-outline"  label="Privacy & Security" onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')} />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="credit-card-outline" label="Payment Methods" onPress={() => navigation.navigate('PaymentMethods')} />
          <MenuItem icon="bell-outline"        label="Notifications"   onPress={() => navigation.navigate('Notifications')} />
          <MenuItem icon="map-marker-outline"  label="Saved Places"    onPress={() => navigation.navigate('SavedPlaces')} />
          <MenuItem icon="gift-outline"        label="Promos & Offers" onPress={() => Alert.alert('Promos', 'No active promos right now.')} />
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="help-circle-outline" label="Help Center"  onPress={() => navigation.navigate('HelpCenter')} />
          <MenuItem icon="chat-outline"        label="Contact Us"   onPress={() => navigation.navigate('HelpCenter')} />
          <MenuItem icon="star-outline"        label="Rate the App" onPress={() => Alert.alert('Rate Us', 'Thanks! Rating coming soon.')} />
        </View>
      </View>

      {/* Sign out */}
      <View style={styles.section}>
        <View style={styles.menuCard}>
          <MenuItem icon="logout" label="Sign Out" danger onPress={handleLogout} />
        </View>
      </View>

      <Text style={styles.version}>SwiftRide Passenger v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { paddingBottom: 40 },
  headerGrad: { padding: 24, paddingTop: 60, alignItems: 'center', gap: 4 },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#000', fontWeight: '800', fontSize: 32 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: '#00D95F', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0A0A0A' },
  userName: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  userPhone: { color: '#666', fontSize: 14 },
  userEmail: { color: '#555', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 40, marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  stat: { alignItems: 'center', gap: 2 },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#666', fontSize: 12 },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { color: '#555', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  menuCard: { backgroundColor: '#111', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1E1E1E' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#00D95F15', justifyContent: 'center', alignItems: 'center' },
  menuIconDanger: { backgroundColor: '#FF444415' },
  menuLabel: { flex: 1, color: '#FFF', fontSize: 15 },
  menuLabelDanger: { color: '#FF4444' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { color: '#666', fontSize: 13 },
  version: { color: '#333', fontSize: 12, textAlign: 'center', marginTop: 16 },
});
