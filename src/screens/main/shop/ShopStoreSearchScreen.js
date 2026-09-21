// @/screens/main/shop/ShopStoreSearchScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SearchBar from "@/components/ui/SearchBar";
import IconListItem from "@/components/ui/IconListItem";
import AppSwitch from "@/components/ui/AppSwitch";
import Button from "@/components/ui/Button";
import ShopErrorState from "@/components/shop/ShopErrorState";
import { useSearchStoresQuery } from "@/features/shop/shopApi";
import { setStore } from "@/features/shop/shopCartSlice";

const TABS = [
  { key: "nearby", label: "Nearby" },
  { key: "groceries", label: "Groceries" },
  { key: "pharmacy", label: "Pharmacy" },
];

const STORE_ICON = { groceries: "leaf", pharmacy: "medical-bag" };

export default function ShopStoreSearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  const [tab, setTab] = useState("nearby");
  const [query, setQuery] = useState("");
  const [anySuitableStore, setAnySuitableStore] = useState(false);

  const { data: stores = [], isLoading, isError, refetch } = useSearchStoresQuery({ q: query, category: tab });

  const chooseStore = (store) => {
    dispatch(setStore({ storeId: store.id, storeName: store.name, category: store.category, distanceKm: store.distanceKm }));
    navigation.navigate("ShopListBuilder", { storeId: store.id, storeName: store.name });
  };

  const chooseAnyStore = () => {
    dispatch(setStore({ storeId: "any", storeName: "Any nearby suitable store" }));
    navigation.navigate("ShopListBuilder", { storeId: "any", storeName: "Any nearby suitable store" });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Where should we shop?" />
      </View>

      <View className="px-5 pb-3">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search store or area"
        />
      </View>

      <View className="flex-row gap-2 px-5 pb-3">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 ${active ? "bg-primary" : "border border-border bg-card"}`}
            >
              <Text className={`text-sm font-inter-medium ${active ? "text-primary-foreground" : "text-foreground-muted"}`}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isError ? (
        <ShopErrorState
          icon="storefront-outline"
          title="Couldn't load nearby stores"
          message="Please check your connection and try again."
          onRetry={refetch}
          onGoBack={() => navigation.goBack()}
        />
      ) : (
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {isLoading && <Text className="py-6 text-center text-sm font-inter text-foreground-muted">Searching…</Text>}

          {!isLoading &&
            stores.map((store) => (
              <IconListItem
                key={store.id}
                leftIcon={STORE_ICON[store.categoryTag] || "storefront-outline"}
                label={store.name}
                subtitle={`${store.distanceKm} km · ${store.category} · ${store.hours}`}
                onPress={() => chooseStore(store)}
                className="mb-2.5"
              />
            ))}

          {!isLoading && stores.length === 0 && (
            <Text className="py-6 text-center text-sm font-inter text-foreground-muted">No stores found nearby.</Text>
          )}

          <View className="mt-4 rounded-2xl border border-border bg-card p-4">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-sm font-inter-semibold text-foreground">Any nearby suitable store</Text>
              <AppSwitch value={anySuitableStore} onValueChange={setAnySuitableStore} />
            </View>
            <Text className="text-xs font-inter text-foreground-muted">
              If your selected store doesn't have the items, your driver may suggest a nearby alternative.
            </Text>
          </View>
        </ScrollView>
      )}

      <View className="px-5" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button onPress={chooseAnyStore} leftIcon="storefront-outline">
          Continue
        </Button>
      </View>
    </View>
  );
}
