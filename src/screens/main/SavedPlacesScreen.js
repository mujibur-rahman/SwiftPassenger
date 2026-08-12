// src/screens/main/SavedPlacesScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const DEFAULT_PLACES = [
  { id: '1', type: 'home', label: 'Home',   icon: '🏠', address: '', locked: false },
  { id: '2', type: 'work', label: 'Work',   icon: '💼', address: '', locked: false },
];

const PLACE_ICONS = ['🏠','💼','🏋️','🛒','🏥','🎓','🏖️','🏟️','🍽️','🎭'];

export default function SavedPlacesScreen({ navigation }) {
  const [places,       setPlaces]       = useState(DEFAULT_PLACES);
  const [showModal,    setShowModal]    = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formLabel,    setFormLabel]    = useState('');
  const [formAddress,  setFormAddress]  = useState('');
  const [formIcon,     setFormIcon]     = useState('⭐');

  const openEdit = (place) => {
    setEditingPlace(place);
    setFormLabel(place.label);
    setFormAddress(place.address);
    setFormIcon(place.icon);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingPlace(null);
    setFormLabel('');
    setFormAddress('');
    setFormIcon('⭐');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formAddress.trim()) { Alert.alert('Error', 'Address is required'); return; }
    if (editingPlace) {
      setPlaces((prev) => prev.map((p) =>
        p.id === editingPlace.id
          ? { ...p, label: formLabel || p.label, address: formAddress, icon: formIcon }
          : p
      ));
    } else {
      setPlaces((prev) => [...prev, {
        id: Date.now().toString(), type: 'custom',
        label: formLabel || 'Custom', icon: formIcon,
        address: formAddress, locked: false,
      }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Place', 'Remove this saved place?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setPlaces((p) => p.filter((pl) => pl.id !== id)) },
    ]);
  };

  return (
    <LinearGradient colors={['#060E1A', '#060E1A']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Places</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Icon name="plus" size={22} color="#00D95F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.hint}>Tap a place to set or update its address</Text>

        <View style={styles.placeList}>
          {places.map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeItem} onPress={() => openEdit(place)}>
              <View style={styles.placeIconWrap}>
                <Text style={styles.placeEmoji}>{place.icon}</Text>
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeLabel}>{place.label}</Text>
                <Text style={styles.placeAddress} numberOfLines={1}>
                  {place.address || 'Tap to set address'}
                </Text>
              </View>
              <View style={styles.placeActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(place)}>
                  <Icon name="pencil-outline" size={16} color="#888" />
                </TouchableOpacity>
                {place.type === 'custom' && (
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(place.id)}>
                    <Icon name="trash-can-outline" size={16} color="#FF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addPlaceBtn} onPress={openAdd}>
          <View style={styles.addPlaceIcon}>
            <Icon name="plus" size={22} color="#00D95F" />
          </View>
          <Text style={styles.addPlaceText}>Add New Place</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit/Add modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editingPlace ? 'Edit Place' : 'Add New Place'}</Text>

            <Text style={styles.label}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconPicker}>
              {PLACE_ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[styles.iconOption, formIcon === ic && styles.iconOptionActive]}
                  onPress={() => setFormIcon(ic)}
                >
                  <Text style={styles.iconOptionText}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Label</Text>
            <TextInput
              style={styles.input}
              value={formLabel}
              onChangeText={setFormLabel}
              placeholder="e.g. Home, Gym..."
              placeholderTextColor="#444"
              selectionColor="#00D95F"
            />

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              value={formAddress}
              onChangeText={setFormAddress}
              placeholder="Enter full address"
              placeholderTextColor="#444"
              selectionColor="#00D95F"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
                <LinearGradient colors={['#00D95F', '#00B84F']} style={styles.saveModalGrad}>
                  <Text style={styles.saveModalText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00D95F20', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00D95F40' },
  scroll: { padding: 16, paddingBottom: 40 },
  hint: { color: '#555', fontSize: 13, marginBottom: 16, marginLeft: 4 },
  placeList: { gap: 10, marginBottom: 16 },
  placeItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#111', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1E1E' },
  placeIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  placeEmoji: { fontSize: 24 },
  placeInfo: { flex: 1 },
  placeLabel: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  placeAddress: { color: '#666', fontSize: 13, marginTop: 2 },
  placeActions: { flexDirection: 'row', gap: 6 },
  editBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#FF444415', justifyContent: 'center', alignItems: 'center' },
  addPlaceBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#111', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#00D95F30', borderStyle: 'dashed' },
  addPlaceIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#00D95F15', justifyContent: 'center', alignItems: 'center' },
  addPlaceText: { color: '#00D95F', fontSize: 15, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 14, borderWidth: 1, borderColor: '#1E3A5F' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  iconPicker: { marginBottom: 4 },
  iconOption: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 2, borderColor: 'transparent' },
  iconOptionActive: { borderColor: '#00D95F', backgroundColor: '#0D1F13' },
  iconOptionText: { fontSize: 22 },
  input: { backgroundColor: '#161616', borderRadius: 12, borderWidth: 1, borderColor: '#1E3A5F', paddingHorizontal: 16, height: 54, color: '#FFF', fontSize: 15 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelModalBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#1E3A5F', justifyContent: 'center', alignItems: 'center' },
  cancelModalText: { color: '#888', fontSize: 15 },
  saveModalBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  saveModalGrad: { height: 52, justifyContent: 'center', alignItems: 'center' },
  saveModalText: { color: '#000', fontSize: 15, fontWeight: '700' },
});
