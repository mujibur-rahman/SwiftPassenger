// passenger-app/src/navigation/RootNavigator.js
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { loadUser } from '../store/slices/authSlice';
import { useSocket } from '../services/SocketContext';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  const { connect } = useSocket();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  useEffect(() => {
    if (isAuthenticated) connect();
  }, [isAuthenticated]);

  useEffect(() => {
    checkActiveRide();
  }, []);

  const checkActiveRide = async () => {
    try {
      const res = await api.get('/rides/active');
      if (res.data?.ride) {
        dispatch(setCurrentRide(res.data.ride));
        dispatch(updateRideStatus(res.data.ride.status));
        if (res.data.driver) dispatch(setDriver(res.data.driver));
          navigation.navigate('ActiveRide');
      }
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00D95F" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
});
