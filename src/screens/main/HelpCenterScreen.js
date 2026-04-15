// src/screens/main/HelpCenterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Linking, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const ACCENT = '#00D95F'; // change to '#FF6B35' for driver app

const FAQS = [
  {
    category: 'Booking',
    items: [
      { q: 'How do I book a ride?',                 a: 'Tap "Where to?" on the home screen, enter your destination, choose your ride type and tap Book.' },
      { q: 'Can I schedule a ride in advance?',     a: 'Scheduled rides are coming soon. Currently all rides are on-demand.' },
      { q: 'How do I cancel a ride?',               a: 'On the active ride screen, tap "Cancel". Note that cancellation fees may apply after a driver is assigned.' },
    ],
  },
  {
    category: 'Payment',
    items: [
      { q: 'What payment methods are accepted?',    a: 'We accept credit/debit cards, the Swift Wallet, and cash (in select areas).' },
      { q: 'How do I get a receipt?',               a: 'Receipts are sent to your email automatically after each trip.' },
      { q: 'Why was I charged more than estimated?', a: 'Final fare may differ due to route changes, waiting time, or surge pricing.' },
    ],
  },
  {
    category: 'Safety',
    items: [
      { q: 'How do I share my trip?',               a: 'On the active ride screen, tap "Share Trip" to send your live location to a contact.' },
      { q: 'What if I left something in the car?',  a: 'Contact your driver through the trip history or reach out to support.' },
      { q: 'How do I report an issue?',             a: 'Go to Activity → select the trip → Report Issue, or contact support below.' },
    ],
  },
];

export default function HelpCenterScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState('');

  const allItems = FAQS.flatMap((c) => c.items.map((item) => ({ ...item, category: c.category })));
  const filtered = searchText
    ? allItems.filter((i) => i.q.toLowerCase().includes(searchText.toLowerCase()))
    : null;

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const contactSupport = () => {
    Alert.alert('Contact Support', 'Choose how to reach us:', [
      { text: 'Email', onPress: () => Linking.openURL('mailto:support@swiftride.com') },
      { text: 'Live Chat', onPress: () => Alert.alert('Live Chat', 'Live chat coming soon!') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#0A0A0A']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search help articles..."
            placeholderTextColor="#444"
            value={searchText}
            onChangeText={setSearchText}
            selectionColor={ACCENT}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={18} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick contact */}
        <View style={styles.contactRow}>
          {[
            { icon: 'chat-outline',  label: 'Live Chat',  onPress: contactSupport },
            { icon: 'email-outline', label: 'Email Us',   onPress: () => Linking.openURL('mailto:support@swiftride.com') },
            { icon: 'phone-outline', label: 'Call Us',    onPress: () => Linking.openURL('tel:+1800SWIFT') },
          ].map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.contactBtn} onPress={opt.onPress}>
              <Icon name={opt.icon} size={22} color={ACCENT} />
              <Text style={styles.contactBtnText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>
          {filtered ? `${filtered.length} results for "${searchText}"` : 'Frequently Asked Questions'}
        </Text>

        {(filtered || FAQS).map((section, si) => {
          const items = filtered ? [section] : section.items;
          const catLabel = filtered ? section.category : section.category;

          if (filtered) {
            const key = `${si}`;
            return (
              <View key={key} style={styles.faqCard}>
                <TouchableOpacity style={styles.faqQ} onPress={() => toggle(key)}>
                  <Text style={styles.faqQText}>{section.q}</Text>
                  <Icon name={expandedId === key ? 'chevron-up' : 'chevron-down'} size={18} color="#555" />
                </TouchableOpacity>
                {expandedId === key && (
                  <View style={styles.faqA}><Text style={styles.faqAText}>{section.a}</Text></View>
                )}
              </View>
            );
          }

          return (
            <View key={section.category} style={styles.faqGroup}>
              <Text style={styles.faqGroupTitle}>{section.category}</Text>
              <View style={styles.faqGroupCard}>
                {section.items.map((item, idx) => {
                  const key = `${si}-${idx}`;
                  return (
                    <View key={key} style={[styles.faqItem, idx < section.items.length - 1 && styles.faqItemBorder]}>
                      <TouchableOpacity style={styles.faqQ} onPress={() => toggle(key)}>
                        <Text style={styles.faqQText}>{item.q}</Text>
                        <Icon name={expandedId === key ? 'chevron-up' : 'chevron-down'} size={18} color="#555" />
                      </TouchableOpacity>
                      {expandedId === key && (
                        <View style={styles.faqA}><Text style={styles.faqAText}>{item.a}</Text></View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Still need help */}
        <View style={styles.stillNeedHelp}>
          <Text style={styles.stillNeedHelpTitle}>Still need help?</Text>
          <Text style={styles.stillNeedHelpSub}>Our support team is available 24/7</Text>
          <TouchableOpacity style={styles.contactSupportBtn} onPress={contactSupport}>
            <LinearGradient colors={[ACCENT, '#00B84F']} style={styles.contactSupportGrad}>
              <Text style={styles.contactSupportText}>Contact Support</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#161616', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 20 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 15 },
  contactRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  contactBtn: { flex: 1, alignItems: 'center', gap: 8, backgroundColor: '#111', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1E1E' },
  contactBtnText: { color: '#CCC', fontSize: 12, fontWeight: '500' },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 12 },
  faqCard: { backgroundColor: '#111', borderRadius: 14, marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#1E1E1E' },
  faqGroup: { marginBottom: 16 },
  faqGroupTitle: { color: '#555', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  faqGroupCard: { backgroundColor: '#111', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1E1E1E' },
  faqItem: {},
  faqItemBorder: { borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  faqQ: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  faqQText: { flex: 1, color: '#FFF', fontSize: 14, fontWeight: '500', marginRight: 8 },
  faqA: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 },
  faqAText: { color: '#888', fontSize: 13, lineHeight: 20 },
  stillNeedHelp: { backgroundColor: '#111', borderRadius: 16, padding: 20, alignItems: 'center', gap: 8, marginTop: 8, borderWidth: 1, borderColor: '#1E1E1E' },
  stillNeedHelpTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  stillNeedHelpSub: { color: '#666', fontSize: 13 },
  contactSupportBtn: { width: '100%', borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  contactSupportGrad: { height: 50, justifyContent: 'center', alignItems: 'center' },
  contactSupportText: { color: '#000', fontSize: 15, fontWeight: '700' },
});
