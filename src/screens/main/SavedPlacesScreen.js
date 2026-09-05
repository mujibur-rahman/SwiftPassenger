// @/screens/main/SavedPlacesScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ListRow from "@/components/ui/ListRow";
import AppTextInput from "@/components/ui/AppTextInput";
import IconListItem from "@/components/ui/IconListItem";
import AppModal from "@/components/ui/AppModal";
import Heading from "@/components/ui/Heading";

const DEFAULT_PLACES = [
  {
    id: "1",
    type: "home",
    label: "Home",
    icon: "🏠",
    address: "",
    locked: false,
  },
  {
    id: "2",
    type: "work",
    label: "Work",
    icon: "💼",
    address: "",
    locked: false,
  },
];

const PLACE_ICONS = [
  "🏠",
  "💼",
  "🏋️",
  "🛒",
  "🏥",
  "🎓",
  "🏖️",
  "🏟️",
  "🍽️",
  "🎭",
];

export default function SavedPlacesScreen({ navigation }) {
  const [places, setPlaces] = useState(DEFAULT_PLACES);
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formLabel, setFormLabel] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formIcon, setFormIcon] = useState("⭐");

  const openEdit = (place) => {
    setEditingPlace(place);
    setFormLabel(place.label);
    setFormAddress(place.address);
    setFormIcon(place.icon);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingPlace(null);
    setFormLabel("");
    setFormAddress("");
    setFormIcon("⭐");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formAddress.trim()) {
      Alert.alert("Error", "Address is required");
      return;
    }

    if (editingPlace) {
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === editingPlace.id
            ? {
              ...p,
              label: formLabel || p.label,
              address: formAddress,
              icon: formIcon,
            }
            : p,
        ),
      );
    } else {
      setPlaces((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "custom",
          label: formLabel || "Custom",
          icon: formIcon,
          address: formAddress,
          locked: false,
        },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Remove Place", "Remove this saved place?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setPlaces((p) => p.filter((pl) => pl.id !== id)),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Saved Places"
        rightIcon="plus"
        className="px-5"
        onRightPress={openAdd}
      />

      <ScrollView
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Heading
          subtitle="Tap a place to set or update its address"
          size="md"
          className="mb-4"
        />

        {/* Place list */}
        <View className="mb-4 gap-2.5">
          {places.map((place) => (
            <IconListItem
              key={place.id}
              icon={place.icon}
              label={place.label}
              subtitle={place.address}
              onPress={() => openEdit(place)}
              onEdit={() => openEdit(place)}
              onDelete={
                place.type === "custom"
                  ? () => handleDelete(place.id)
                  : undefined
              }
            />
          ))}
        </View>

        {/* Add place */}
        <ListRow
          variant="dashed"
          icon="plus"
          label="Add New Place"
          onPress={openAdd}
        />
      </ScrollView>

      {/* Edit / Add modal */}
      <AppModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlace ? "Edit Place" : "Add New Place"}
        primaryLabel="Save"
        onPrimary={handleSave}
        secondaryLabel="Cancel"
      >
        {/* Icon picker */}
        <Text className="mb-2 text-xs font-inter-semibold tracking-wide text-foreground-muted">
          Icon
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {PLACE_ICONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              className={`mr-2 h-12 w-12 items-center justify-center rounded-xl border-2 ${formIcon === ic
                ? "border-primary bg-primary/15"
                : "border-transparent bg-background-muted"
                }`}
              onPress={() => setFormIcon(ic)}
            >
              <Text className="text-[22px]">{ic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="gap-3.5">
          <AppTextInput
            label="Label"
            value={formLabel}
            onChangeText={setFormLabel}
            placeholder="e.g. Home, Gym..."
          />
          <AppTextInput
            label="Address"
            required
            value={formAddress}
            onChangeText={setFormAddress}
            placeholder="Enter full address"
          />
        </View>
      </AppModal>
    </View>
  );
}
