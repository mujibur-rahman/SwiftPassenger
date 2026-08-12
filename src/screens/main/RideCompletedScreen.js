// src/screens/main/RideCompletedScreen.js  (Passenger)
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { resetRide } from '../../store/slices/rideSlice';
import { clearLocations } from '../../store/slices/locationSlice';
import api from '../../services/api';

export default function RideCompletedScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentRide } = useSelector((s) => s.ride);
  const { pickupAddress, destinationAddress } = useSelector((s) => s.location);
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const submitRating = async () => {
    try { await api.post(`/rides/${currentRide?.id}/rate`, { rating, tip }); } catch (e) {}
    setSubmitted(true);
  };

  const handleDone = () => { dispatch(resetRide()); dispatch(clearLocations()); navigation.navigate('Tabs'); };
  const fare = currentRide?.fare || 14.50;

  return (
    <LinearGradient colors={['#060E1A', '#0D1B0F', '#060E1A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={[styles.checkWrap, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.checkCircle}>
            <Icon name="check" size={48} color="#000" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>You've arrived!</Text>
          <Text style={styles.subtitle}>Thanks for riding with SwiftRide</Text>

          <View style={styles.fareCard}>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Total Fare</Text>
              <Text style={styles.fareAmount}>${fare.toFixed(2)}</Text>
            </View>
          </View>

          {!submitted ? (
            <View style={styles.rateSection}>
              <Text style={styles.rateTitle}>How was your ride?</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Icon name={star <= rating ? 'star' : 'star-outline'} size={40} color={star <= rating ? '#FFD700' : '#333'} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.tipRow}>
                {[0, 1, 2, 5].map((t) => (
                  <TouchableOpacity key={t} style={[styles.tipBtn, tip === t && styles.tipBtnActive]} onPress={() => setTip(t)}>
                    <Text style={[styles.tipBtnText, tip === t && styles.tipBtnTextActive]}>{t === 0 ? 'No tip' : `$${t}`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} onPress={submitRating} disabled={rating === 0}>
                <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.submitBtnGrad}>
                  <Text style={styles.submitBtnText}>Submit Rating</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.thankYou}>
              <Text style={styles.thankYouText}>🙏 Thanks for rating!</Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 80, alignItems: 'center' },
  checkWrap: { marginBottom: 24 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  content: { width: '100%', alignItems: 'center', gap: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
  subtitle: { color: '#666', fontSize: 16 },
  fareCard: { width: '100%', backgroundColor: '#111', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#222' },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { color: '#888', fontSize: 14 },
  fareAmount: { color: '#00D95F', fontSize: 32, fontWeight: '800' },
  rateSection: { width: '100%', alignItems: 'center', gap: 16 },
  rateTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  stars: { flexDirection: 'row', gap: 8 },
  tipRow: { flexDirection: 'row', gap: 10, width: '100%' },
  tipBtn: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  tipBtnActive: { borderColor: '#00D95F', backgroundColor: '#0D1F13' },
  tipBtnText: { color: '#666', fontSize: 13 },
  tipBtnTextActive: { color: '#00D95F' },
  submitBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnGrad: { height: 54, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  thankYou: { alignItems: 'center', paddingVertical: 20 },
  thankYouText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  doneBtn: { width: '100%', height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  doneBtnText: { color: '#888', fontSize: 16 },
});
