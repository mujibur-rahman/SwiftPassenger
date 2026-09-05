import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "@/store";
import RootNavigator from "@/navigation/RootNavigator";
import { SocketProvider } from "@/services/SocketContext"; // passenger
import { ThemeProvider, useTheme } from "@/theme";

function AppNavigation() {
  const { isDark, colors, isReady } = useTheme();

  useEffect(() => {
    if (!isReady) return;
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [isReady, colors.background]);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      border: colors.border,
      text: colors.text,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  // inside App component
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#060E1A");
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#060E1A" }}>
      <Provider store={store}>
        <ThemeProvider>
          <SafeAreaProvider>
            <SocketProvider>
              <AppNavigation />
            </SocketProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
