// src/screens/main/ActivityScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getRideHistory } from '../../store/slices/rideSlice';

const STATUS_COLORS = { completed: '#00D95F', cancelled: '#FF4444', ongoing: '#4A9EFF' };

export default function ActivityScreen() {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((s) => s.ride);
  useEffect(() => { dispatch(getRideHistory()); }, []);

  const renderItem = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[item.status] || '#888'}20` }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || '#888' }]}>{item.status?.toUpperCase()}</Text>
        </View>
        <Text style={styles.rideDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.rideRoute}>
        <View style={styles.routeDots}>
          <View style={styles.dotGreen} /><View style={styles.dotLine} /><View style={styles.dotRed} />
        </View>
        <View style={styles.routeAddresses}>
          <Text style={styles.routeAddr} numberOfLines={1}>{item.pickupAddress}</Text>
          <Text style={styles.routeAddr} numberOfLines={1}>{item.destinationAddress}</Text>
        </View>
      </View>
      <View style={styles.rideFooter}>
        <View style={styles.rideMetric}><Icon name="clock-outline" size={14} color="#666" /><Text style={styles.rideMetricText}>{item.duration || '12 min'}</Text></View>
        <Text style={styles.rideFare}>${item.fare?.toFixed(2) || '14.50'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Rides</Text>
        <Text style={styles.subtitle}>{history.length} trips total</Text>
      </View>
      <FlatList
        data={history} renderItem={renderItem} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(getRideHistory())} tintColor="#00D95F" />}
        ListEmptyComponent={!loading && <View style={styles.empty}><Text style={styles.emptyIcon}>🚗</Text><Text style={styles.emptyText}>No rides yet</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060E1A' },
  header: { padding: 24, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  subtitle: { color: '#555', fontSize: 14, marginTop: 4 },
  list: { padding: 16, gap: 12 },
  rideCard: { backgroundColor: '#111', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E1E1E' },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  rideDate: { color: '#555', fontSize: 13 },
  rideRoute: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  routeDots: { alignItems: 'center', gap: 3, paddingTop: 2 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00D95F' },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF4444' },
  dotLine: { width: 2, height: 16, backgroundColor: '#333' },
  routeAddresses: { flex: 1, gap: 12 },
  routeAddr: { color: '#CCC', fontSize: 13 },
  rideFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1E1E1E' },
  rideMetric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rideMetricText: { color: '#666', fontSize: 12 },
  rideFare: { marginLeft: 'auto', color: '#00D95F', fontSize: 16, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});
