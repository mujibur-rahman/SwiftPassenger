// @/screens/main/food/RestaurantMenuScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import { useGetRestaurantQuery } from "@/features/food/foodApi";
import { addItem, selectCartCount } from "@/features/food/cartSlice";
import Button from "@/components/ui/Button";
import AppModal from "@/components/ui/AppModal";
import MenuItemRow from "@/components/food/MenuItemRow";
import IconButton from "@/components/ui/IconButton";

const TABS = ["Menu", "Info", "Reviews"];
const MENU_CHIPS = ["Burgers", "Sides", "Combo", "Drinks"];

// Rich local fallback when API is offline
const MOCK_RESTAURANT = {
  id: "1",
  name: "Burger King",
  category: "Burgers · Fast Food",
  rating: 4.5,
  ratingCount: 2300,
  etaMinutes: "20–30 min",
  deliveryFee: 1.5,
  heroImage: require("@assets/images/restaurants/burger-king.jpg"),
  logo: require("@assets/images/restaurants/burger-king.jpg"),
  menu: [
    {
      id: "m1",
      name: "Chicken Burger",
      description: "Crispy chicken, lettuce, tomato, spicy mayo, sesame bun",
      price: 5.99,
      category: "Burgers",
      image: require("@assets/images/products/chicken-burger.jpg"),
    },
    {
      id: "m2",
      name: "Beef Burger",
      description: "Juicy beef, cheese, lettuce, tomato, pickles",
      price: 6.99,
      category: "Burgers",
      image: require("@assets/images/products/beef-burger.jpg"),
    },
    {
      id: "m3",
      name: "Cheese Burger",
      description: "Double cheese, beef patty, special sauce",
      price: 6.49,
      category: "Burgers",
      image: require("@assets/images/products/cheese-burger.jpg"),
    },
    {
      id: "m4",
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      price: 2.99,
      category: "Sides",
      image: require("@assets/images/products/fries.jpg"),
    },
    {
      id: "m5",
      name: "Fried Chicken",
      description: "Crispy fried chicken pieces",
      price: 7.49,
      category: "Sides",
      image: require("@assets/images/products/fried-chicken.jpg"),
    },
  ],
};

export default function RestaurantMenuScreen({ route }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const onPrimary = colors?.primaryForeground ?? (isDark ? "#060E1A" : "#FFFFFF");
  const warning = colors?.warning ?? "#FBBF24";
  const foreground = colors?.foreground ?? (isDark ? "#F0F9FF" : "#0F172A");

  const { restaurantId, restaurantName } = route.params || {};
  const { data: apiRestaurant, isLoading } = useGetRestaurantQuery(restaurantId, {
    skip: !restaurantId,
  });
  const cartCount = useSelector(selectCartCount);

  const restaurant = useMemo(() => {
    if (apiRestaurant) {
      return {
        ...MOCK_RESTAURANT,
        ...apiRestaurant,
        name: apiRestaurant.name || restaurantName || MOCK_RESTAURANT.name,
        heroImage: MOCK_RESTAURANT.heroImage,
        logo: MOCK_RESTAURANT.logo,
        menu: (apiRestaurant.menu || MOCK_RESTAURANT.menu).map((item, i) => ({
          ...item,
          image:
            item.image ||
            MOCK_RESTAURANT.menu[i % MOCK_RESTAURANT.menu.length].image,
        })),
      };
    }
    return { ...MOCK_RESTAURANT, name: restaurantName || MOCK_RESTAURANT.name };
  }, [apiRestaurant, restaurantName]);

  const [tab, setTab] = useState("Menu");
  const [menuChip, setMenuChip] = useState("Burgers");
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  const filteredMenu = useMemo(() => {
    if (!restaurant?.menu) return [];
    return restaurant.menu.filter((item) => item.category === menuChip);
  }, [restaurant, menuChip]);

  const openItem = (item) => {
    setSelectedItem(item);
    setQty(1);
  };

  const confirmAdd = () => {
    if (!selectedItem) return;
    dispatch(
      addItem({
        restaurantId: restaurantId || restaurant.id,
        restaurantName: restaurant.name,
        menuItemId: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        qty,
        note: "",
        image: selectedItem.image || null,
      })
    );
    setSelectedItem(null);
  };

  if (isLoading && !restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Hero image */}
      <View style={{ height: 210 }}>
        <Image
          source={restaurant.heroImage}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
        />

        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          variant="ghost"
          iconSize={22}
          className="absolute left-4 bottom-4 z-10"
        />
      </View>

      {/* Overlapping logo + info card */}
      <View className="px-5 pt-5 pb-3">
        <View className="flex-row items-center gap-5">
          <View className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-card bg-card">
            <Image
              source={restaurant.logo}
              style={{ width: 64, height: 64 }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-xl font-inter-bold text-foreground" numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text className="text-sm font-inter text-foreground-muted">
              {restaurant.category}
            </Text>

            <View className="flex-row items-center gap-1">
              <Icon name="star" size={14} color={warning} />
              <Text className="text-sm font-inter-medium text-foreground-secondary">
                {restaurant.rating} ({(restaurant.ratingCount / 1000).toFixed(1)}k+) ·{" "}
                {restaurant.etaMinutes}
              </Text>
            </View>
          </View>
          <IconButton
            icon={saved ? "heart" : "heart-outline"}
            onPress={() => setSaved((s) => !s)}
            variant="ghost"
            iconSize={22}
          />
        </View>


        {/* Delivery row */}
        <View className="mt-3 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <Icon name="bike" size={16} color={primary} />
            <Text className="text-xs font-inter-medium text-foreground-secondary">
              Delivery {restaurant.etaMinutes}
            </Text>
          </View>
          <Button variant="link" size="xs" fullWidth={false} leftIcon="information-outline">About</Button>
        </View>
      </View>

      {/* Tabs: Menu / Info / Reviews */}
      <View className="mt-4 flex-row border-b border-border px-5">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className="mr-6 pb-3"
              style={{
                borderBottomWidth: active ? 2 : 0,
                borderBottomColor: primary,
              }}
            >
              <Text
                className={`text-sm font-inter-semibold ${active ? "text-foreground" : "text-foreground-muted"
                  }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: cartCount > 0 ? 100 : 32,
        }}
      >
        {tab === "Menu" && (
          <>
            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, marginBottom: 16 }}
            >
              {MENU_CHIPS.map((chip) => {
                const active = menuChip === chip;
                return (
                  <TouchableOpacity
                    key={chip}
                    onPress={() => setMenuChip(chip)}
                    activeOpacity={0.8}
                    className={`rounded-full px-4 py-2 ${active ? "bg-primary" : "border border-border bg-card"
                      }`}
                  >
                    <Text
                      className={`text-sm font-inter-semibold ${active
                        ? "text-primary-foreground"
                        : "text-foreground-secondary"
                        }`}
                    >
                      {chip}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {filteredMenu.length === 0 ? (
              <Text className="mt-6 text-center font-inter text-foreground-muted">
                No items in this category
              </Text>
            ) : (
              filteredMenu.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  primary={primary}
                  onPrimary={onPrimary}
                  onAdd={openItem}
                />
              ))
            )}
          </>
        )}

        {tab === "Info" && (
          <View>
            <Text className="mb-2 text-[15px] font-inter-semibold text-foreground">
              Delivery info
            </Text>
            <Text className="font-inter text-foreground-muted">
              Delivery fee ${restaurant.deliveryFee?.toFixed(2) ?? "1.50"} ·{" "}
              {restaurant.etaMinutes}
            </Text>
          </View>
        )}

        {tab === "Reviews" && (
          <Text className="font-inter text-foreground-muted">
            No reviews yet. Be the first!
          </Text>
        )}
      </ScrollView>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <View
          className="absolute bottom-0 left-0 right-0 px-5"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Button onPress={() => navigation.navigate("FoodCart")} rightIcon="cart">
            {`View Cart (${cartCount})`}
          </Button>
        </View>
      )}

      {/* Add to Cart modal */}
      <AppModal
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        primaryLabel={
          selectedItem
            ? `Add to Cart · $${(selectedItem.price * qty).toFixed(2)}`
            : undefined
        }
        onPrimary={confirmAdd}
        secondaryLabel={null}
      >
        {selectedItem && (
          <View>
            <View className="mb-4 h-36 w-full overflow-hidden rounded-2xl">
              <Image
                source={selectedItem.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <Text className="mb-4 font-inter text-foreground-muted">
              {selectedItem.description}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-inter-semibold text-foreground-secondary">
                Quantity
              </Text>

              <View className="flex-row items-center gap-5">
                <IconButton
                  icon="minus"
                  size={32}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  variant="muted"
                />
                <Text className="text-base font-inter-bold text-foreground">{qty}</Text>
                <IconButton
                  icon="plus"
                  size={32}
                  onPress={() => setQty((q) => q + 1)}
                  variant="custom"
                  style={{
                    backgroundColor: primary,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </AppModal>
    </View>
  );
}