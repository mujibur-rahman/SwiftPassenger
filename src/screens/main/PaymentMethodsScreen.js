// src/screens/main/PaymentMethodsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import api from '../../services/api';

const CARD_BRAND_ICONS = {
  visa:       { icon: 'credit-card', color: '#1A1F71' },
  mastercard: { icon: 'credit-card', color: '#EB001B' },
  amex:       { icon: 'credit-card', color: '#007BC1' },
  default:    { icon: 'credit-card-outline', color: '#888' },
};

const MOCK_METHODS = [
  { id: '1', type: 'card', brand: 'visa',       lastFour: '4242', isDefault: true,  label: 'Visa' },
  { id: '2', type: 'card', brand: 'mastercard', lastFour: '8888', isDefault: false, label: 'Mastercard' },
];

export default function PaymentMethodsScreen({ navigation }) {
  const [methods,  setMethods]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchMethods(); }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await api.get('/passengers/payment-methods');
      setMethods(res.data.methods?.length ? res.data.methods : MOCK_METHODS);
    } catch {
      setMethods(MOCK_METHODS);
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (id) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const deleteMethod = (id) => {
    Alert.alert('Remove Card', 'Remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          setDeleting(id);
          try {
            await api.delete(`/passengers/payment-methods/${id}`);
          } catch {}
          setMethods((prev) => prev.filter((m) => m.id !== id));
          setDeleting(null);
        },
      },
    ]);
  };

  const CardItem = ({ item }) => {
    const brand = CARD_BRAND_ICONS[item.brand] || CARD_BRAND_ICONS.default;
    return (
      <View style={[styles.cardItem, item.isDefault && styles.cardItemDefault]}>
        <View style={[styles.cardIconWrap, { backgroundColor: `${brand.color}20` }]}>
          <Icon name={brand.icon} size={24} color={brand.color} />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardLabel}>{item.label} •••• {item.lastFour}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          {!item.isDefault && (
            <TouchableOpacity
              style={styles.setDefaultBtn}
              onPress={() => setDefault(item.id)}
            >
              <Text style={styles.setDefaultText}>Set default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteMethod(item.id)}
            disabled={deleting === item.id}
          >
            {deleting === item.id
              ? <ActivityIndicator size="small" color="#FF4444" />
              : <Icon name="trash-can-outline" size={18} color="#FF4444" />}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#0A0A0A']} style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Wallet balance card */}
        <LinearGradient colors={['#00D95F20', '#00D95F05']} style={styles.walletCard}>
          <View style={styles.walletRow}>
            <Icon name="wallet-outline" size={28} color="#00D95F" />
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Swift Wallet</Text>
              <Text style={styles.walletBalance}>$24.50</Text>
            </View>
            <TouchableOpacity style={styles.topUpBtn}>
              <Text style={styles.topUpText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Saved cards */}
        <Text style={styles.sectionTitle}>Saved Cards</Text>

        {loading ? (
          <ActivityIndicator color="#00D95F" style={{ marginTop: 20 }} />
        ) : methods.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="credit-card-off-outline" size={48} color="#333" />
            <Text style={styles.emptyText}>No payment methods saved</Text>
          </View>
        ) : (
          <View style={styles.cardList}>
            {methods.map((item) => <CardItem key={item.id} item={item} />)}
          </View>
        )}

        {/* Add new card */}
        <TouchableOpacity
          style={styles.addCardBtn}
          onPress={() => Alert.alert('Add Card', 'Card entry form coming soon.\nIntegrate Stripe SDK for production.')}
        >
          <View style={styles.addCardIcon}>
            <Icon name="plus" size={22} color="#00D95F" />
          </View>
          <Text style={styles.addCardText}>Add New Card</Text>
          <Icon name="chevron-right" size={18} color="#444" />
        </TouchableOpacity>

        {/* Other options */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Other Options</Text>
        <View style={styles.otherOptions}>
          {[
            { icon: 'cash',           label: 'Cash',        sub: 'Pay with cash on arrival' },
            { icon: 'bank-outline',   label: 'Bank Transfer', sub: 'Direct bank payment' },
          ].map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.otherOption}>
              <View style={styles.otherOptionIcon}>
                <Icon name={opt.icon} size={22} color="#00D95F" />
              </View>
              <View style={styles.otherOptionInfo}>
                <Text style={styles.otherOptionLabel}>{opt.label}</Text>
                <Text style={styles.otherOptionSub}>{opt.sub}</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#444" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.secureNote}>
          🔒  Your payment details are encrypted and secure
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  walletCard: {
    borderRadius: 16, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#00D95F30',
  },
  walletRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  walletInfo: { flex: 1 },
  walletLabel: { color: '#888', fontSize: 13 },
  walletBalance: { color: '#FFF', fontSize: 24, fontWeight: '800', marginTop: 2 },
  topUpBtn: {
    backgroundColor: '#00D95F', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  topUpText: { color: '#000', fontWeight: '700', fontSize: 14 },
  sectionTitle: {
    color: '#888', fontSize: 12, fontWeight: '600',
    letterSpacing: 0.5, marginBottom: 12,
  },
  cardList: { gap: 10, marginBottom: 12 },
  cardItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#111', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#1E1E1E',
  },
  cardItemDefault: { borderColor: '#00D95F40', backgroundColor: '#0D1F13' },
  cardIconWrap: {
    width: 48, height: 48, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  cardInfo: { flex: 1, gap: 4 },
  cardLabel: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#00D95F20', borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: '#00D95F40',
  },
  defaultBadgeText: { color: '#00D95F', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setDefaultBtn: {
    backgroundColor: '#1A1A1A', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  setDefaultText: { color: '#888', fontSize: 11 },
  deleteBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FF444415', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#FF444430',
  },
  addCardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#111', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#00D95F30', borderStyle: 'dashed',
  },
  addCardIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#00D95F15', justifyContent: 'center', alignItems: 'center',
  },
  addCardText: { flex: 1, color: '#00D95F', fontSize: 15, fontWeight: '500' },
  otherOptions: { gap: 8 },
  otherOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#111', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#1E1E1E',
  },
  otherOptionIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#00D95F15', justifyContent: 'center', alignItems: 'center',
  },
  otherOptionInfo: { flex: 1 },
  otherOptionLabel: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  otherOptionSub:   { color: '#666', fontSize: 12, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { color: '#555', fontSize: 15 },
  secureNote: {
    color: '#444', fontSize: 12, textAlign: 'center',
    marginTop: 24, lineHeight: 18,
  },
});
