// src/screens/main/HomeScreen.js  (Passenger)
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Platform,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
// import { setCurrentLocation, setPickup } from '../../store/slices/locationSlice';
import ServiceCard from '../../components/ServiceCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileHeader from '../../components/ProfileHeader';

// Use PROVIDER_GOOGLE only if API key is configured.
// For Expo Go / dev without API key, omit provider to use default map.
let PROVIDER_GOOGLE;
try {
  PROVIDER_GOOGLE = require('react-native-maps').PROVIDER_GOOGLE;
} catch {}

const JOBS = [
  {id: "1", title: "Ride", icon: "ride", color: "rgba(108, 143, 224, 0.25)", iconColor: "rgba(108, 143, 224, 0.75)"  },
  {id: "2", title: "Food delivery", icon: "food", color: "rgba(224, 148, 107, 0.25)", iconColor: "rgba(224, 148, 107, 0.75)"  },
  {id: "3", title: "Gig jobs", icon: "gig", color: "rgba(79, 182, 168, 0.25)", iconColor: "rgba(79, 182, 168, 0.75)"  },
  {id: "4", title: "Parcel delivery", icon: "delivery", color: "rgba(203, 163, 92, 0.25)", iconColor: "rgba(203, 163, 92, 0.75)"  },
  {id: "5", title: "Shop for me", icon: "shoppingCart", color: "rgba(216, 136, 176, 0.25)", iconColor: "rgba(216, 136, 176, 0.75)"  },
  {id: "6", title: "Marketplace pickup", icon: "card", color: "rgba(127, 184, 107, 0.25)", iconColor: "rgba(127, 184, 107, 0.75)"  },
  {id: "7", title: "Car insurance", icon: "store", color: "rgba(139, 143, 224, 0.25)", iconColor: "rgba(139, 143, 224, 0.75)"  },
  {id: "8", title: "Car rental", icon: "uploadTruck", color: "rgba(139, 143, 224, 0.25)", iconColor: "rgba(139, 143, 224, 0.75)"  },
]

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user }            = useSelector((s) => s.auth);
  // const { currentLocation } = useSelector((s) => s.location);
  const mapRef   = useRef(null);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    requestLocation();
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 50 }).start();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      // dispatch(setCurrentLocation(coords));
      dispatch(setPickup({ coords, address: 'Current Location' }));
      mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 1000);
    } catch (e) {
      console.warn('Location error:', e.message);
    }
  };

  const MapFallback = () => (
    <View style={styles.mapFallback}>
      <Text style={styles.mapFallbackIcon}>🗺️</Text>
      <Text style={styles.mapFallbackText}>Map unavailable</Text>
      <Text style={styles.mapFallbackSub}>Add Google Maps API key in app.json</Text>
    </View>
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* {mapError ? <MapFallback /> : (
        <MapView
          ref={mapRef}
          // omit provider prop to use default (works without API key in Expo Go)
          style={styles.map}
          showsUserLocation
          showsMyLocationButton={false}
          onMapReady={() => setMapError(false)}
          onMapLoadingError={() => setMapError(true)}
          initialRegion={{
            latitude:  currentLocation?.latitude  || -33.8688,
            longitude: currentLocation?.longitude || 151.2093,
            latitudeDelta: 0.05, longitudeDelta: 0.05,
          }}
        >
          {currentLocation && (
            <Marker coordinate={currentLocation}>
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
              </View>
            </Marker>
          )}
        </MapView>
      )}       */}
     
     <ProfileHeader />

     <View style={{flex: 1}}> 
      <Text style={{color: 'white'}}>Advertisement will show...</Text>
     </View>

      <View style={styles.grid}>
        {JOBS.map((job) => (
          <ServiceCard key={job.id} job={job} />
        ))}
      </View>

      {/* <FlatList
        data={JOBS}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{paddingVertical: 18, paddingHorizontal: 20}}
        columnWrapperStyle={{
          justifyContent: "space-between",          
          marginBottom: 20,
          // gap: 0,          
        }}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ServiceCard job={item} />
          </View>
        )}
        ListHeaderComponent={
          <> */}
          {/* Top gradient + header */}
          {/* <LinearGradient
            colors={['rgba(10,10,10,0.95)', 'rgba(10,10,10,0.5)', 'transparent']}
            style={styles.topOverlay}
            pointerEvents="box-none"
          >
            <View style={styles.topBar}>
              <View>
                <Text style={styles.greeting}>Good day 👋</Text>
                <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Rider'}</Text>
              </View>
              <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'R'}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient> */}
          {/* <ProfileHeader />

          </>
        }
        showsVerticalScrollIndicator={false}
      /> */}

      {/* Bottom sheet */}
      {/* <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}> */}
        {/* <View style={styles.handle} />
        <Text style={styles.whereToText}>Where to?</Text>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('RideBooking')}
          activeOpacity={0.8}
        >
          <View style={styles.searchDot} />
          <Text style={styles.searchPlaceholder}>Search destination...</Text>
          <View style={styles.searchIcon}>
            <Icon name="magnify" size={18} color="#000" />
          </View>
        </TouchableOpacity> */}

        {/* Quick actions */}
        {/* <View style={styles.quickActions}>
          {[
            { icon: '🏠', label: 'Home',  sub: 'Set address' },
            { icon: '💼', label: 'Work',  sub: 'Set address' },
            { icon: '⭐', label: 'Saved', sub: 'Places' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickBtn}
              onPress={() => navigation.navigate('RideBooking')}
            >
              <View style={styles.quickIconWrap}>
                <Text style={styles.quickEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Recent places */}
        {/* <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Places</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {[
          { icon: '🏪', name: 'Downtown Mall',     address: '123 Market St' },
          { icon: '✈️', name: 'Airport Terminal 1', address: 'International Airport' },
        ].map((place) => (
          <TouchableOpacity
            key={place.name}
            style={styles.recentItem}
            onPress={() => navigation.navigate('RideBooking')}
          >
            <View style={styles.recentIcon}><Text>{place.icon}</Text></View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>{place.name}</Text>
              <Text style={styles.recentAddress}>{place.address}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#444" />
          </TouchableOpacity>
        ))} */}
      {/* </Animated.View> */}

      {/* My location button */}
      {/* <TouchableOpacity style={styles.myLocBtn} onPress={requestLocation}>
        <Icon name="crosshairs-gps" size={22} color="#00D95F" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: 18, paddingTop: 18, paddingBottom: 80 },
  // cardWrapper: {
  //   width: "30%",
  //   overflow: "hidden",
  // },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#2A2F35",
    borderRadius: 20,
  },
  map: { flex: 1 },
  mapFallback: {
    flex: 1, backgroundColor: '#1a1a2e',
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  mapFallbackIcon: { fontSize: 48 },
  mapFallbackText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  mapFallbackSub: { color: '#666', fontSize: 13 },
  userMarker: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,217,95,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#00D95F',
  },
  userMarkerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00D95F' },
  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingHorizontal: 20, paddingBottom: 40,
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#888', fontSize: 13 },
  userName: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#00D95F', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#000', fontWeight: '700', fontSize: 16 },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 20,
  },
  handle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  whereToText: { color: '#FFF', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 20,
  },
  searchDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00D95F', marginRight: 12 },
  searchPlaceholder: { flex: 1, color: '#555', fontSize: 15 },
  searchIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#00D95F', justifyContent: 'center', alignItems: 'center',
  },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickBtn: {
    flex: 1, backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#222',
  },
  quickIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  quickEmoji: { fontSize: 20 },
  quickLabel: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  quickSub: { color: '#555', fontSize: 11, marginTop: 2 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recentTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  seeAll: { color: '#00D95F', fontSize: 14 },
  recentItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  recentIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  recentInfo: { flex: 1 },
  recentName: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  recentAddress: { color: '#666', fontSize: 12, marginTop: 2 },
  myLocBtn: {
    position: 'absolute', right: 20, bottom: 340,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#2A2A2A',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
});
