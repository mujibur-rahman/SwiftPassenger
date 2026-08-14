// src/screens/main/ActiveRideScreen.js  (Passenger)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Linking, Share } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRide } from '../../../store/slices/rideSlice';
import { DARK_MAP_STYLE } from '../../../utils/mapStyles';

const STATUS_CONFIG = {
  searching: { label: 'Finding your driver...', color: '#FFA500' },
  accepted:  { label: 'Driver on the way',      color: '#00D95F' },
  pickup:    { label: 'Driver has arrived!',     color: '#00D95F' },
  ongoing:   { label: 'On your way',             color: '#4A9EFF' },
  completed: { label: 'Arrived!',                color: '#00D95F' },
  cancelled: { label: 'Ride cancelled',          color: '#FF4444' },
  no_drivers:{ label: 'No drivers nearby',       color: '#FF4444' },
};

export default function ActiveRideScreen({ navigation }) {
  const dispatch = useDispatch();
  const { rideStatus, driver, driverLocation, currentRide, eta } = useSelector((s) => s.ride);
  const { pickup, destination, pickupAddress, destinationAddress } = useSelector((s) => s.location);
  const mapRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 50 }).start();
    if (rideStatus === 'searching') {
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])).start();
    }
  }, [rideStatus]);

  useEffect(() => {
    if (rideStatus === 'completed') setTimeout(() => navigation.replace('RideCompleted'), 500);
    if (rideStatus === 'cancelled' || rideStatus === 'no_drivers') setTimeout(() => navigation.goBack(), 3000);
  }, [rideStatus]);

  const config = STATUS_CONFIG[rideStatus] || STATUS_CONFIG.searching;

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} customMapStyle={DARK_MAP_STYLE} showsUserLocation
        initialRegion={{ latitude: pickup?.latitude || 37.7749, longitude: pickup?.longitude || -122.4194, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
        {pickup && <Marker coordinate={pickup}><View style={styles.markerGreen}><Icon name="map-marker" size={20} color="#000" /></View></Marker>}
        {destination && <Marker coordinate={destination}><View style={styles.markerRed}><Icon name="flag" size={16} color="#FFF" /></View></Marker>}
        {driverLocation && <Marker coordinate={driverLocation}><View style={styles.carMarker}><Text style={styles.carEmoji}>🚗</Text></View></Marker>}
        {driverLocation && pickup && <Polyline coordinates={[driverLocation, pickup]} strokeColor="#00D95F" strokeWidth={3} lineDashPattern={[8, 4]} />}
      </MapView>

      <View style={styles.statusPill}>
        <View style={[styles.statusDot, { backgroundColor: config.color }]} />
        <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
      </View>

      <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
        {(rideStatus === 'accepted' || rideStatus === 'pickup') && (
          <View style={styles.etaBar}>
            <Icon name="clock-outline" size={16} color="#888" />
            <Text style={styles.etaText}>{rideStatus === 'pickup' ? 'Driver is here!' : `Arrives in ${eta || '5'} min`}</Text>
          </View>
        )}
        {driver && (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}><Text style={styles.driverAvatarText}>{driver.name?.[0] || 'D'}</Text></View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverRating}>⭐ {driver.rating || '4.8'} · {driver.trips || '1,234'} trips</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => driver?.phone && Linking.openURL(`tel:${driver.phone}`)}>
                <Icon name="phone" size={18} color="#00D95F" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="message-outline" size={18} color="#00D95F" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareBtn} onPress={() => Share.share({ message: 'Track my ride!' })}>
            <Icon name="share-variant-outline" size={16} color="#888" />
            <Text style={styles.shareBtnText}>Share Trip</Text>
          </TouchableOpacity>
          {(rideStatus === 'searching' || rideStatus === 'accepted') && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => Alert.alert('Cancel Ride', 'Are you sure?', [{ text: 'No', style: 'cancel' }, { text: 'Yes', style: 'destructive', onPress: () => dispatch(cancelRide(currentRide?.id)) }])}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        {rideStatus === 'searching' && (
          <Animated.View style={[styles.searchingWave, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.searchingText}>🔍  Searching for nearby drivers...</Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060E1A' },
  map: { flex: 1 },
  statusPill: { position: 'absolute', top: 50, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#222' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '600' },
  markerGreen: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#00D95F', justifyContent: 'center', alignItems: 'center' },
  markerRed: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF4444', justifyContent: 'center', alignItems: 'center' },
  carMarker: { backgroundColor: '#FFF', borderRadius: 20, padding: 4, borderWidth: 2, borderColor: '#333' },
  carEmoji: { fontSize: 20 },
  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 14 },
  etaBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1A1A1A', borderRadius: 10, padding: 12 },
  etaText: { color: '#CCC', fontSize: 14 },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14 },
  driverAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#00D95F', justifyContent: 'center', alignItems: 'center' },
  driverAvatarText: { color: '#000', fontWeight: '700', fontSize: 20 },
  driverInfo: { flex: 1 },
  driverName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  driverRating: { color: '#888', fontSize: 13, marginTop: 2 },
  driverActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00D95F20', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00D95F40' },
  actions: { flexDirection: 'row', gap: 10 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14 },
  shareBtnText: { color: '#888', fontSize: 14 },
  cancelBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF444420', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FF444440' },
  cancelBtnText: { color: '#FF4444', fontSize: 14, fontWeight: '600' },
  searchingWave: { alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14 },
  searchingText: { color: '#888', fontSize: 14 },
});
