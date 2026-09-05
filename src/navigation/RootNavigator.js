import { useFonts } from "expo-font";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, View } from "react-native";

import AuthNavigator from "@/navigation/AuthNavigator";
import MainNavigator from "@/navigation/MainNavigator";
import {
  hydrateAuth,
  selectAuthHydrated,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";
import { useSocket } from "@/services/SocketContext";
// Passenger active ride (optional recovery):
// import { useGetActiveRideQuery } from "@/features/ride/rideApi";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isHydrated = useSelector(selectAuthHydrated);
  const { connect } = useSocket();

  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  });

  // ---------- ALL HOOKS FIRST (no early return before these) ----------

  // 1. Hydrate auth from AsyncStorage
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  // 2. Socket connection if user is authenticated
  useEffect(() => {
    if (isAuthenticated) connect();
  }, [isAuthenticated, connect]);

  // 3. Hide splash when fonts ready
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // ---------- THEN conditional UI ----------
  const showLoader = (!fontsLoaded && !fontError) || !isHydrated;

  if (showLoader) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#060E1A" },
        contentStyle: { backgroundColor: "#060E1A" },
      }}
    >
      {accessToken ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
