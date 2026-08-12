import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { userLoggedIn, userLoggedOut } from "../store/auth/authSlice";
import { useSocket } from "../services/SocketContext";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { connect } = useSocket();

  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "sans-light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
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

  // Now safe to return early
  if (!fontsLoaded || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#38BDF8" />
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
