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
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthNavigator from "@/navigation/AuthNavigator";
import MainNavigator from "@/navigation/MainNavigator";
import { userLoggedIn, userLoggedOut } from "@/features/auth/authSlice";
import { useSocket } from "@/services/SocketContext";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { connect } = useSocket();
  const [isLoading, setIsLoading] = useState(true);
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
  // ✅ All hooks must be called before any early return
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userString = await AsyncStorage.getItem("user");
        if (token && userString) {
          const user = JSON.parse(userString);
          dispatch(
            userLoggedIn({
              accessToken: token,
              user,
            }),
          );
        } else {
          dispatch(userLoggedOut());
        }
      } catch (error) {
        console.log("Failed to load session:", error);
        dispatch(userLoggedOut());
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, [dispatch]);
  useEffect(() => {
    if (accessToken) {
      connect();
    }
  }, [accessToken]);
  // Hide splash when fonts ready
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // ---------- THEN conditional UI ----------
  const showLoader = (!fontsLoaded && !fontError) || isLoading;
  if (showLoader) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FF6B35" />
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