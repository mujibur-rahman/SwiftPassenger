// src/screens/main/RideBookingScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert, Animated } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setPickup, setDestination } from '../../store/slices/locationSlice';
import { requestRide, getFareEstimate } from '../../store/slices/rideSlice';
import { DARK_MAP_STYLE } from '../../utils/mapStyles';

const RIDE_TYPES = [
  { id: 'economy', name: 'SwiftX', icon: '🚗', multiplier: 1.0 },
  { id: 'comfort', name: 'Comfort', icon: '🚙', multiplier: 1.4 },
  { id: 'xl', name: 'XL', icon: '🚐', multiplier: 1.8 },
  { id: 'premium', name: 'Black', icon: '🏎️', multiplier: 2.5 },
];

export default function RideBookingScreen({ navigation }) {
  const dispatch = useDispatch();
  const { fareEstimate, loading } = useSelector((s) => s.ride);
  const { currentLocation, pickup, destination, pickupAddress, destinationAddress } = useSelector((s) => s.location);
  const [selectedRide, setSelectedRide] = useState('economy');
  const [destInput, setDestInput] = useState(destinationAddress);
  const [pickupInput, setPickupInput] = useState(pickupAddress || 'Current Location');
  const [stage, setStage] = useState('search');
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sheetAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleDestinationSelect = async () => {
    if (!destInput.trim()) return;
    const mockDest = { latitude: 37.7849, longitude: -122.4094 };
    dispatch(setDestination({ coords: mockDest, address: destInput }));
    if (pickup) {
      dispatch(getFareEstimate({ origin: pickup, destination: mockDest }));
      setRouteCoords([pickup, mockDest]);
    }
    setStage('confirm');
  };

  const handleBookRide = () => {
    if (!pickup || !destination) { Alert.alert('Error', 'Please set pickup and destination'); return; }
    dispatch(requestRide({ pickup, destination, pickupAddress: pickupInput, destinationAddress: destInput, rideType: selectedRide }))
      .then((res) => { if (!res.error) navigation.navigate('ActiveRide'); });
  };

  const selected = RIDE_TYPES.find((r) => r.id === selectedRide);
  const basePrice = fareEstimate?.price || 12.50;

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} customMapStyle={DARK_MAP_STYLE} showsUserLocation
        initialRegion={{ latitude: currentLocation?.latitude || 37.7749, longitude: currentLocation?.longitude || -122.4194, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        {pickup && <Marker coordinate={pickup} pinColor="#00D95F" />}
        {destination && <Marker coordinate={destination} pinColor="#FF4444" />}
        {routeCoords.length > 1 && <Polyline coordinates={routeCoords} strokeColor="#00D95F" strokeWidth={3} />}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={22} color="#FFF" />
      </TouchableOpacity>

      <Animated.View style={[styles.panel, { opacity: sheetAnim }]}>
        {stage === 'search' ? (
          <View style={styles.searchPanel}>
            <View style={styles.locationRow}>
              <View style={styles.dotTrack}>
                <View style={styles.dotGreen} />
                <View style={styles.dotLine} />
                <View style={styles.dotRed} />
              </View>
              <View style={styles.inputs}>
                <TextInput style={styles.locInput} value={pickupInput} onChangeText={setPickupInput} placeholderTextColor="#555" selectionColor="#00D95F" />
                <View style={styles.inputDivider} />
                <TextInput style={styles.locInput} placeholder="Where are you going?" placeholderTextColor="#555" value={destInput} onChangeText={setDestInput} onSubmitEditing={handleDestinationSelect} returnKeyType="search" autoFocus selectionColor="#00D95F" />
              </View>
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={handleDestinationSelect}>
              <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.searchBtnGrad}>
                <Text style={styles.searchBtnText}>Search</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.confirmPanel}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rideTypes}>
              {RIDE_TYPES.map((ride) => (
                <TouchableOpacity key={ride.id} style={[styles.rideCard, selectedRide === ride.id && styles.rideCardActive]} onPress={() => setSelectedRide(ride.id)}>
                  <Text style={styles.rideEmoji}>{ride.icon}</Text>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <Text style={styles.ridePrice}>${(basePrice * ride.multiplier).toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.bookBtn, loading && styles.bookBtnDisabled]} onPress={handleBookRide} disabled={loading}>
              <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.bookBtnGrad}>
                {loading ? <ActivityIndicator color="#000" /> : (
                  <View style={styles.bookBtnContent}>
                    <Text style={styles.bookBtnText}>Book {selected?.name}</Text>
                    <Text style={styles.bookBtnPrice}>${(basePrice * (selected?.multiplier || 1)).toFixed(2)}</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  map: { flex: 1 },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  searchPanel: { gap: 16 },
  locationRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  dotTrack: { alignItems: 'center', paddingVertical: 8, gap: 4 },
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#00D95F' },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF4444' },
  dotLine: { width: 2, flex: 1, backgroundColor: '#333', minHeight: 20 },
  inputs: { flex: 1, gap: 2 },
  locInput: { backgroundColor: '#1A1A1A', borderRadius: 10, paddingHorizontal: 14, height: 48, color: '#FFF', fontSize: 15 },
  inputDivider: { height: 4 },
  searchBtn: { borderRadius: 12, overflow: 'hidden' },
  searchBtnGrad: { height: 52, justifyContent: 'center', alignItems: 'center' },
  searchBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  confirmPanel: { gap: 16 },
  rideTypes: { marginHorizontal: -20, paddingHorizontal: 20 },
  rideCard: { width: 100, backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14, alignItems: 'center', marginRight: 10, borderWidth: 2, borderColor: 'transparent' },
  rideCardActive: { borderColor: '#00D95F', backgroundColor: '#0D1F13' },
  rideEmoji: { fontSize: 24, marginBottom: 6 },
  rideName: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  ridePrice: { color: '#00D95F', fontSize: 14, fontWeight: '700', marginTop: 4 },
  bookBtn: { borderRadius: 14, overflow: 'hidden' },
  bookBtnDisabled: { opacity: 0.7 },
  bookBtnGrad: { height: 58, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  bookBtnContent: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  bookBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
  bookBtnPrice: { color: '#000', fontSize: 17, fontWeight: '700' },
});
