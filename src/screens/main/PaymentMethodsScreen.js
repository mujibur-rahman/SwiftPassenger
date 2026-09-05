// src/screens/main/PaymentMethodsScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CARD_BRAND } from "@/constants/Colors";
import {
  useGetPaymentMethodsQuery,
  useSetDefaultPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} from "@/features/payment/paymentApi";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ListRow from "@/components/ui/ListRow";

const MOCK_METHODS = [
  {
    id: "1",
    type: "card",
    brand: "visa",
    lastFour: "4242",
    isDefault: true,
    label: "Visa",
  },
  {
    id: "2",
    type: "card",
    brand: "mastercard",
    lastFour: "8888",
    isDefault: false,
    label: "Mastercard",
  },
];

export default function PaymentMethodsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const {
    data: methods = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPaymentMethodsQuery(undefined, {
    // caching + revalidation
    refetchOnMountOrArgChange: 30, // 30s এর মধ্যে mount হলে cache use
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [setDefault, { isLoading: isSettingDefault }] =
    useSetDefaultPaymentMethodMutation();
  const [deleteMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();

  // API fail হলে mock fallback (dev)
  const list = !isError && methods.length ? methods : MOCK_METHODS;

  const handleSetDefault = async (id) => {
    try {
      await setDefault(id).unwrap();
    } catch {
      Alert.alert("Error", "Could not set default payment method");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Remove Card", "Remove this payment method?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMethod(id).unwrap();
          } catch {
            Alert.alert("Error", "Could not remove payment method");
          }
        },
      },
    ]);
  };

  const CardItem = ({ item }) => {
    const brand = CARD_BRAND[item.brand] || CARD_BRAND.default;

    return (
      <View
        className={`flex-row items-center gap-3 rounded-2xl border bg-card p-4 ${item.isDefault ? "border-primary/40" : "border-border"
          }`}
      >
        <View
          className={`h-12 w-12 items-center justify-center rounded-xl ${brand.tw}`}
        >
          <Icon name={brand.icon} size={24} color={brand.color} />
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-[15px] font-inter-medium text-foreground">
            {item.label} •••• {item.lastFour}
          </Text>
          {item.isDefault && (
            <View className="self-start rounded border border-primary/40 bg-primary/15 px-2 py-0.5">
              <Text className="text-[10px] font-inter-bold tracking-wide text-primary">
                DEFAULT
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-2">
          {!item.isDefault && (
            <TouchableOpacity
              className="rounded-lg border border-border bg-background-muted px-2.5 py-1.5"
              onPress={() => handleSetDefault(item.id)}
              disabled={isSettingDefault}
              activeOpacity={0.7}
            >
              <Text className="text-[11px] font-inter text-foreground-muted">
                Set default
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-[10px] border border-error/30 bg-error/15"
            onPress={() => handleDelete(item.id)}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#F87171" />
            ) : (
              <Icon name="trash-can-outline" size={18} color="#F87171" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Payment Methods" className="px-5" />

      <ScrollView
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#38BDF8"
            colors={["#38BDF8"]}
          />
        }
      >
        {/* Wallet */}
        <View className="mb-6 rounded-2xl border border-primary/25 bg-primary/10 p-5">
          <View className="flex-row items-center gap-3.5">
            <Icon name="wallet-outline" size={28} color="#38BDF8" />
            <View className="flex-1">
              <Text className="text-[13px] font-inter text-foreground-muted">
                Swift Wallet
              </Text>
              <Text className="mt-0.5 text-2xl font-inter-extrabold text-foreground">
                $24.50
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-[10px] bg-primary px-4 py-2"
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert("Top Up", "Wallet top-up coming soon.")
              }
            >
              <Text className="text-sm font-inter-bold text-primary-foreground">
                Top Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved cards */}
        <Text className="mb-3 text-xs font-inter-semibold tracking-wide text-foreground-muted">
          Saved Cards
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#38BDF8" className="mt-5" />
        ) : list.length === 0 ? (
          <View className="items-center gap-3 py-10">
            <Icon name="credit-card-off-outline" size={48} color="#1E3A5F" />
            <Text className="text-[15px] font-inter text-foreground-muted">
              No payment methods saved
            </Text>
          </View>
        ) : (
          <View className="mb-3 gap-2.5">
            {list.map((item) => (
              <CardItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Add card */}
        <ListRow
          variant="dashed"
          icon="plus"
          label="Add New Card"
          className="mt-1"
          onPress={() =>
            Alert.alert(
              "Add Card",
              "Card entry form coming soon.\nIntegrate Stripe SDK for production.",
            )
          }
        />

        {/* Other options */}
        <Text className="mb-3 mt-6 text-xs font-inter-semibold tracking-wide text-foreground-muted">
          Other Options
        </Text>

        <View className="gap-2">
          {[
            { icon: "cash", label: "Cash", sub: "Pay with cash on arrival" },
            {
              icon: "bank-outline",
              label: "Bank Transfer",
              sub: "Direct bank payment",
            },
          ].map((opt) => (
            <ListRow
              key={opt.label}
              icon={opt.icon}
              label={opt.label}
              subtitle={opt.sub}
              onPress={() => { }}
            />
          ))}
        </View>

        <Text className="mt-6 text-center text-xs font-inter leading-5 text-foreground-muted">
          🔒 Your payment details are encrypted and secure
        </Text>
      </ScrollView>
    </View>
  );
}
