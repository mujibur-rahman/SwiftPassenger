// @/screens/main/shop/ShopListBuilderScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import AppTextInput from "@/components/ui/AppTextInput";
import AppModal from "@/components/ui/AppModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import RangeSlider from "@/components/ui/RangeSlider";
import {
  selectShopCart,
  selectCanContinue,
  addItem,
  updateItem,
  removeItem,
  setBudgetLimit,
  setSubstitutionPreference,
} from "@/features/shop/shopCartSlice";

const SUBSTITUTION_OPTIONS = [
  { id: "suggest_similar", label: "Similar item is okay", icon: "swap-horizontal" },
  { id: "call_me", label: "Call me first", icon: "phone-outline" },
];

// A rough icon per common grocery keyword — purely cosmetic, matches the
// mockup showing a distinct icon per item instead of one generic basket
// icon for everything.
const ITEM_ICONS = [
  { match: /milk|cream|yogurt|dairy/i, icon: "bottle-soda-classic-outline" },
  { match: /egg/i, icon: "egg-outline" },
  { match: /bread|bun|loaf/i, icon: "baguette" },
  { match: /rice|flour|grain/i, icon: "grain" },
  { match: /apple|fruit|banana|orange/i, icon: "food-apple-outline" },
  { match: /vegetable|onion|potato|tomato/i, icon: "carrot" },
  { match: /chicken|meat|beef|fish/i, icon: "food-drumstick-outline" },
  { match: /soap|shampoo|toothpaste/i, icon: "bottle-tonic-outline" },
];
const iconForItem = (name = "") => ITEM_ICONS.find((e) => e.match.test(name))?.icon || "basket-outline";

export default function ShopListBuilderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const cart = useSelector(selectShopCart);
  const canContinue = useSelector(selectCanContinue);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftQty, setDraftQty] = useState("1");
  const [draftUnit, setDraftUnit] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [prefModalVisible, setPrefModalVisible] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setDraftName("");
    setDraftQty("1");
    setDraftUnit("");
    setDraftNote("");
    setAddModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setDraftName(item.name);
    setDraftQty(String(item.qty));
    setDraftUnit(item.unit || "");
    setDraftNote(item.note || "");
    setAddModalVisible(true);
  };

  const saveItem = () => {
    if (!draftName.trim()) return;
    const payload = {
      name: draftName.trim(),
      qty: Math.max(1, parseInt(draftQty, 10) || 1),
      unit: draftUnit.trim(),
      note: draftNote.trim(),
    };
    if (editingId) {
      dispatch(updateItem({ id: editingId, ...payload }));
    } else {
      dispatch(addItem(payload));
    }
    setAddModalVisible(false);
  };

  const goCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert("Your list is empty", "Add at least one item before continuing.");
      return;
    }
    if (!cart.budgetLimit) {
      Alert.alert("Set a budget", "Set how much you're comfortable spending.");
      return;
    }
    navigation.navigate("ShopCheckout");
  };

  const selectedPref = SUBSTITUTION_OPTIONS.find((o) => o.id === cart.substitutionPreference) || SUBSTITUTION_OPTIONS[0];

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="What do you need?" onBack={() => navigation.goBack()} />
        <Text className="mb-3 text-xs font-inter text-foreground-muted">
          Add items, quantities and notes. You can also set your budget and preferences below.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        {cart.items.length === 0 && (
          <View className="items-center rounded-2xl border border-dashed border-border bg-card px-4 py-8 mb-3">
            <Icon name="cart-outline" size={32} color={muted} />
            <Text className="mt-2 text-center text-[13px] font-inter text-foreground-muted">
              Add whatever you need — the shopper will find it in-store.
            </Text>
          </View>
        )}

        {cart.items.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() => openEditModal(item)}
            className="mb-2.5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-background-muted">
              <Icon name={iconForItem(item.name)} size={20} color={primary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-bold text-foreground" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-xs font-inter text-foreground-muted" numberOfLines={1}>
                Qty {item.qty}{item.unit ? ` · ${item.unit}` : ""}
              </Text>
              {!!item.note && (
                <Text className="text-xs font-inter text-foreground-muted" numberOfLines={1}>
                  {item.note}
                </Text>
              )}
            </View>
            <IconButton icon="pencil-outline" size={20} variant="ghost" onPress={() => openEditModal(item)} />
            <IconButton icon="trash-can-outline" size={20} variant="ghost" color={muted} onPress={() => dispatch(removeItem(item.id))} />
          </TouchableOpacity>
        ))}

        <Button variant="outline" leftIcon="plus" fullWidth onPress={openAddModal} className="mt-1 mb-7">
          Add item
        </Button>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">
          Shopping budget
        </Text>
        <View className="mb-1 flex-row items-baseline gap-1">
          <Text className="text-2xl font-inter-bold text-foreground">${cart.budgetLimit || 0}</Text>
        </View>
        <RangeSlider
          min={5}
          max={100}
          step={5}
          value={cart.budgetLimit || 25}
          onChange={(v) => dispatch(setBudgetLimit(v))}
          formatLabel={(v) => `$${v}`}
        />
        <View className="mt-1 flex-row justify-between">
          <Text className="text-[11px] font-inter text-foreground-muted">$5</Text>
          <Text className="text-[11px] font-inter text-foreground-muted">$100</Text>
        </View>

        <View className="mt-7 mb-4">
          <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">
            Substitution preference
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPrefModalVisible(true)}
            className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
          >
            <Icon name={selectedPref.icon} size={18} color={primary} />
            <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">{selectedPref.label}</Text>
            <Icon name="chevron-down" size={18} color={muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={goCheckout} disabled={!canContinue}>
          Continue
        </Button>
      </View>

      <AppModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        title={editingId ? "Edit item" : "Add item"}
        primaryLabel={editingId ? "Save changes" : "Add to list"}
        onPrimary={saveItem}
        primaryDisabled={!draftName.trim()}
      >
        <View className="gap-3">
          <AppTextInput label="Item" placeholder="e.g. Fresh milk" value={draftName} onChangeText={setDraftName} />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <AppTextInput label="Quantity" placeholder="1" value={draftQty} onChangeText={setDraftQty} keyboardType="number-pad" />
            </View>
            <View className="flex-1">
              <AppTextInput label="Unit (optional)" placeholder="e.g. 1L, 5kg" value={draftUnit} onChangeText={setDraftUnit} />
            </View>
          </View>
          <AppTextInput label="Note (optional)" placeholder="e.g. any brand, prefer full cream" value={draftNote} onChangeText={setDraftNote} />
        </View>
      </AppModal>

      <AppModal
        visible={prefModalVisible}
        onClose={() => setPrefModalVisible(false)}
        title="If an item is unavailable"
        hideActions
      >
        <View className="gap-2.5">
          {SUBSTITUTION_OPTIONS.map((opt) => {
            const active = cart.substitutionPreference === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.85}
                onPress={() => {
                  dispatch(setSubstitutionPreference(opt.id));
                  setPrefModalVisible(false);
                }}
                className={`flex-row items-center gap-3 rounded-2xl border p-4 ${active ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <Icon name={opt.icon} size={20} color={active ? primary : muted} />
                <Text className={`flex-1 text-[14px] font-inter-semibold ${active ? "text-primary" : "text-foreground"}`}>
                  {opt.label}
                </Text>
                {active && <Icon name="check" size={18} color={primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppModal>
    </View>
  );
}
