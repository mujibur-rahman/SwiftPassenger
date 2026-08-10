// src/screens/auth/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrandBadge from '../../components/ui/BrandBadge';

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60 }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(dotOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => setTimeout(() => navigation.replace('Login'), 1200));
  }, []);

  return (
    <LinearGradient colors={['#0A0A0A', '#0D1B0F', '#0A0A0A']} style={styles.container}>
      <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity }]}>
        {/* <View style={styles.logoCircle}><Text style={styles.logoIcon}>⚡</Text></View> */}
        <BrandBadge size={100} textColor="#FFD700" />
        {/* <Text style={styles.logoText}>Swift<Text style={styles.logoAccent}>Ride</Text></Text> */}
        <Animated.Text style={[styles.tagline, { opacity: dotOpacity }]}>Your ride, your way</Animated.Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoWrap: { alignItems: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00D95F', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoIcon: { fontSize: 36 },
  logoText: { fontSize: 36, fontWeight: '800', color: '#FFF', letterSpacing: -1 },
  logoAccent: { color: '#00D95F' },
  tagline: { color: '#888', fontSize: 14, marginTop: 8, letterSpacing: 1 },
});
