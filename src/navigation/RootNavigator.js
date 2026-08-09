// src/navigation/RootNavigator.js
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { userLoggedIn, userLoggedOut } from "../store/auth/authSlice";
import { useSocket } from "../services/SocketContext";

const Stack = createStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { connect } = useSocket();

  const [isLoading, setIsLoading] = useState(true);

  // Load session from AsyncStorage when app starts
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

  // Connect socket when user is authenticated
  useEffect(() => {
    if (accessToken) {
      connect();
    }
  }, [accessToken]);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00D95F" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9c3333",
  },
});
