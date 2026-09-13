import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import AppDropdown from "@/components/ui/AppDropdown";
import StepProgress from "@/components/marketplace/StepProgress";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  setDraftField,
  selectMarketplaceDraft,
} from "@/features/marketplace/marketplacePickupSlice";

const CATEGORY_OPTIONS = [
  { label: "Electronics", value: "electronics", icon: "chip" },
  { label: "Fashion & Clothing", value: "fashion", icon: "tshirt-crew" },
  { label: "Home & Furniture", value: "home", icon: "sofa" },
  { label: "Sports & Outdoors", value: "sports", icon: "basketball" },
  { label: "Books & Stationery", value: "books", icon: "book-open-variant" },
  { label: "Toys & Games", value: "toys", icon: "controller-classic" },
  { label: "Health & Beauty", value: "health", icon: "heart-pulse" },
  { label: "Automotive", value: "automotive", icon: "car" },
  { label: "Food & Groceries", value: "food", icon: "food-apple" },
  { label: "Other", value: "other", icon: "dots-horizontal" },
];

export default function MarketplaceItemDetailsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);

  const [itemDescription, setItemDescription] = useState(draft.itemDescription || "");
  const [itemQuantity, setItemQuantity] = useState(draft.itemQuantity || 1);
  const [itemCategory, setItemCategory] = useState(draft.itemCategory || "");
  const [approximateValue, setApproximateValue] = useState(draft.approximateValue || "");
  const [itemNotes, setItemNotes] = useState(draft.itemNotes || "");

  const changeQty = (d) => setItemQuantity((q) => Math.max(1, Math.min(99, (Number(q) || 1) + d)));

  const handleNext = () => {
    if (!itemDescription.trim()) {
      Alert.alert("Required", "Please describe the item.");
      return;
    }
    dispatch(setDraftField({ key: "itemDescription", value: itemDescription.trim() }));
    dispatch(setDraftField({ key: "itemQuantity", value: Number(itemQuantity) || 1 }));
    dispatch(setDraftField({ key: "itemCategory", value: itemCategory }));
    dispatch(setDraftField({ key: "approximateValue", value: approximateValue.trim() }));
    dispatch(setDraftField({ key: "itemNotes", value: itemNotes.trim() }));
    navigation.navigate("MarketplaceDeliveryLocation");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Item Details" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={3} total={5} />

        {/* Product image placeholder */}
        <View className="mb-5 items-center overflow-hidden rounded-2xl border border-border bg-card">
          <Image
            source={DUMMY.itemProduct}
            className="w-full h-46"
            resizeMode="cover"
          />
          <View className="w-full flex-row items-center justify-center gap-2 border-t border-border py-3">
            <Icon name="camera-plus-outline" size={18} color={colors?.primary} />
            <Text className="text-sm font-inter-medium text-primary">Add item photo (optional)</Text>
          </View>
        </View>

        <View className="mb-5 gap-3 rounded-2xl border border-border bg-card p-4">
          <AppTextInput
            label="Item description"
            value={itemDescription}
            onChangeText={setItemDescription}
            placeholder="Enter item description"
            required
          />

          <View>
            <Text className="mb-1.5 text-xs font-inter-medium text-foreground-muted">Quantity</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => changeQty(-1)}
                className="h-14 w-14 items-center justify-center rounded-xl border border-border bg-background-muted"
              >
                <Icon name="minus" size={18} color={colors?.foreground} />
              </TouchableOpacity>
              <Text className="min-w-8 text-center text-lg font-inter-bold text-foreground">
                {itemQuantity}
              </Text>
              <TouchableOpacity
                onPress={() => changeQty(1)}
                className="h-14 w-14 items-center justify-center rounded-xl border border-border bg-background-muted"
              >
                <Icon name="plus" size={18} color={colors?.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          <AppDropdown
            label="Category"
            placeholder="Select a category…"
            options={CATEGORY_OPTIONS}
            value={itemCategory}
            onChange={(val) => setItemCategory(val)}
            leftIcon="tag-outline"
          />
          <AppTextInput
            // label="Approximate value"
            label="Price"
            value={approximateValue}
            onChangeText={setApproximateValue}
            placeholder="Enter item price"
            keyboardType="numeric"
          />
          <AppTextInput
            label="Special instructions"
            value={itemNotes}
            onChangeText={setItemNotes}
            placeholder="Handle with care, check original box…"
            multiline
            numberOfLines={3}
          />
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
