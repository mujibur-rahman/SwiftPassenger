// src/screens/main/DriverHomeScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Switch,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus } from '../../store/slices/riderSlice';
import { useDriverSocket } from '../../services/DriverSocketContext';
import { DARK_MAP_STYLE } from '../../utils/mapStyles';

export default function DriverHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isOnline, currentLocation, todayStats, rideStatus, incomingRide } = useSelector((s) => s.driver);
  const { driver } = useSelector((s) => s.auth);
  const { goOnline, goOffline, updateLocation } = useDriverSocket();
  const mapRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const locationSub = useRef(null);

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 50 }).start();
    requestLocationPermission();
    return () => { locationSub.current?.remove(); };
  }, []);

  useEffect(() => {
    if (incomingRide && rideStatus === 'incoming') navigation.navigate('IncomingRide');
  }, [incomingRide, rideStatus]);

  useEffect(() => {
    if (rideStatus === 'accepted' || rideStatus === 'ongoing') navigation.navigate('ActiveRide');
  }, [rideStatus]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    startLocationTracking();
  };

  const startLocationTracking = async () => {
    // Get initial position
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    updateLocation(coords);
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 800);

    // Watch position
    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (loc) => updateLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }),
    );
  };

  const toggleOnline = (val) => {
    dispatch(setOnlineStatus(val));
    if (val) goOnline(); else goOffline();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: currentLocation?.latitude || 37.7749,
          longitude: currentLocation?.longitude || -122.4194,
          latitudeDelta: 0.015, longitudeDelta: 0.015,
        }}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View style={[styles.driverMarker, isOnline && styles.driverMarkerOnline]}>
              <Text style={styles.driverMarkerIcon}>🚗</Text>
            </View>
          </Marker>
        )}
      </MapView>

      <LinearGradient
        colors={['rgba(10,10,10,0.95)', 'rgba(10,10,10,0.7)', 'transparent']}
        style={styles.topOverlay}
        pointerEvents="box-none"
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hello, {driver?.name?.split(' ')[0] || 'Driver'}</Text>
            <View style={[styles.statusPill, isOnline ? styles.statusOnline : styles.statusOffline]}>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? '#00D95F' : '#666' }]} />
              <Text style={[styles.statusText, { color: isOnline ? '#00D95F' : '#888' }]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <View style={styles.onlineToggle}>
            <Text style={styles.toggleLabel}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: '#333', true: '#FF6B3580' }}
              thumbColor={isOnline ? '#FF6B35' : '#555'}
            />
          </View>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.statsRow}>
          {[
            { label: 'Trips Today', value: todayStats.trips, icon: 'car' },
            { label: "Today's Earnings", value: `$${todayStats.earnings.toFixed(2)}`, icon: 'cash' },
            { label: 'Hours Online', value: `${todayStats.hours.toFixed(1)}h`, icon: 'clock-outline' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Icon name={stat.icon} size={20} color="#FF6B35" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {isOnline ? (
          <View style={styles.onlineMessage}>
            <View style={styles.onlinePulse}><View style={styles.onlinePulseDot} /></View>
            <Text style={styles.onlineText}>Waiting for ride requests...</Text>
          </View>
        ) : (
          <View style={styles.offlineMessage}>
            <Text style={styles.offlineText}>You are offline. Toggle to start receiving requests.</Text>
          </View>
        )}

        <View style={styles.actions}>
          {[
            { icon: 'chart-bar', label: 'Earnings', onPress: () => navigation.navigate('Earnings') },
            { icon: 'history', label: 'History', onPress: () => {} },
            { icon: 'navigation-outline', label: 'Navigate', onPress: () => {} },
            { icon: 'account-outline', label: 'Profile', onPress: () => navigation.navigate('Profile') },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionBtn} onPress={a.onPress}>
              <Icon name={a.icon} size={22} color="#FF6B35" />
              <Text style={styles.actionText}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsRow}>
          {[
            { label: 'Rating', value: `⭐ ${driver?.rating || '4.92'}` },
            { label: 'Acceptance', value: `${driver?.acceptanceRate || 94}%` },
            { label: 'Completion', value: `${driver?.completionRate || 98}%` },
          ].map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <View style={styles.metricDivider} />}
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{m.value}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060E1A' },
  map: { flex: 1 },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 50, paddingHorizontal: 20, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 4, borderWidth: 1 },
  statusOnline: { backgroundColor: '#00D95F10', borderColor: '#00D95F30' },
  statusOffline: { backgroundColor: '#66666610', borderColor: '#66666630' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },
  onlineToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { color: '#888', fontSize: 13 },
  driverMarker: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#555' },
  driverMarkerOnline: { borderColor: '#FF6B35', backgroundColor: '#FF6B3530' },
  driverMarkerIcon: { fontSize: 22 },
  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 16 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#222' },
  statValue: { color: '#FFF', fontSize: 16, fontWeight: '700', marginTop: 4 },
  statLabel: { color: '#555', fontSize: 10, textAlign: 'center' },
  onlineMessage: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FF6B3510', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FF6B3530' },
  onlinePulse: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FF6B3530', justifyContent: 'center', alignItems: 'center' },
  onlinePulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B35' },
  onlineText: { color: '#FF6B35', fontSize: 14, fontWeight: '500' },
  offlineMessage: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, alignItems: 'center' },
  offlineText: { color: '#666', fontSize: 14, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { alignItems: 'center', gap: 6, flex: 1 },
  actionText: { color: '#888', fontSize: 11 },
  metricsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14 },
  metricItem: { flex: 1, alignItems: 'center', gap: 4 },
  metricValue: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  metricLabel: { color: '#555', fontSize: 11 },
  metricDivider: { width: 1, height: 30, backgroundColor: '#1E3A5F' },
});
