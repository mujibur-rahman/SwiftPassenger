// src/screens/auth/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import BrandBadge from "../../components/ui/BrandBadge";

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => navigation.replace("Login"), 1200);
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Animated.View
        className="items-center"
        style={{
          transform: [{ scale }],
          opacity,
        }}
      >
        <BrandBadge size={100} />

        <Animated.Text
          className="mt-3 text-sm font-sans tracking-[1px] text-foreground-muted"
          style={{ opacity: taglineOpacity }}
        >
          Your ride, your way
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
