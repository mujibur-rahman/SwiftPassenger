// passenger-app/src/navigation/AuthNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "@/screens/auth/SplashScreen";
import LoginScreen from "@/screens/auth/LoginScreen";
import RegisterScreen from "@/screens/auth/RegisterScreen";
import OTPScreen from "@/screens/auth/OTPScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#060E1A" },
        contentStyle: { backgroundColor: "#060E1A" },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
    </Stack.Navigator>
  );
}
