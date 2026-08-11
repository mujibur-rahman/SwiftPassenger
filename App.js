// passenger-app/App.js
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { store } from './src/store';
import { store } from "./src/store/index";
import RootNavigator from "./src/navigation/RootNavigator";
import { SocketProvider } from "./src/services/SocketContext"; // ← SocketProvider, not DriverSocketProvider

// Custom dark theme
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0A0A0A",
    card: "#0A0A0A",
    border: "#2A2A2A",
    text: "#F5F5F5",
    primary: "#CBA35C",
  },
};

export default function App() {
  // inside App component
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#0A0A0A");
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <SocketProvider>
            <NavigationContainer theme={AppTheme}>
              <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
              <RootNavigator />
            </NavigationContainer>
          </SocketProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
