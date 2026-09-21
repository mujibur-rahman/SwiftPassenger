// @/components/shop/ShopStepper.jsx
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

// Two rows of 3 — matches the image exactly (Assigned/To Store/Shopping,
// then Checkout/Purchased/Delivering). "delivered" has no step of its own
// here; ShopDeliveredScreen takes over once status reaches it.
export const SHOP_STEPS = [
  { key: "assigned", label: "Assigned", icon: "account-check-outline" },
  { key: "to_store", label: "To Store", icon: "storefront-outline" },
  { key: "shopping", label: "Shopping", icon: "cart-outline" },
  { key: "checkout", label: "Checkout", icon: "cash-check" },
  { key: "purchased", label: "Purchased", icon: "package-variant-closed" },
  { key: "delivering", label: "Delivering", icon: "bike-fast" },
];

export function shopStepIndex(status) {
  const i = SHOP_STEPS.findIndex((s) => s.key === status);
  return i === -1 ? (status === "delivered" ? SHOP_STEPS.length : 0) : i;
}

export default function ShopStepper({ status }) {
  const { colors, isDark } = useTheme();
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const border = colors?.border ?? (isDark ? "#1E3A5F" : "#BAE6FD");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const currentIndex = shopStepIndex(status);

  const renderRow = (steps, offset) => (
    <View className="flex-row items-center">
      {steps.map((step, i) => {
        const index = offset + i;
        const done = index < currentIndex;
        const active = index === currentIndex;
        const reached = done || active;
        return (
          <React.Fragment key={step.key}>
            {i > 0 && (
              <View
                className="h-0.5 flex-1"
                style={{ backgroundColor: reached ? success : border }}
              />
            )}
            <View className="items-center" style={{ width: 64 }}>
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: reached ? `${success}22` : "transparent",
                  borderWidth: 1.5,
                  borderColor: reached ? success : border,
                }}
              >
                <Icon name={done ? "check" : step.icon} size={16} color={reached ? success : muted} />
              </View>
              <Text
                className="mt-1 text-center text-[11px] font-inter-medium"
                style={{ color: reached ? success : muted }}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );

  return (
    <View className="gap-3">
      {renderRow(SHOP_STEPS.slice(0, 3), 0)}
      {renderRow(SHOP_STEPS.slice(3, 6), 3)}
    </View>
  );
}
