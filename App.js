// passenger-app/App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { SocketProvider } from './src/services/SocketContext'; // ← SocketProvider, not DriverSocketProvider

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <SocketProvider>                     
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
              <RootNavigator />
            </NavigationContainer>
          </SocketProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}