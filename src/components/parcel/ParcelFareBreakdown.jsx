import React from "react";
import { View, Text } from "react-native";

/**
 * Shared across ParcelFareEstimate, ParcelOrderReview, and ParcelReceipt —
 * the one Parcel component that's genuinely reused 3+ times (everything
 * else stays inline in its screen, same as Marketplace only ever
 * extracted InfoCard + StepProgress, not one component per field group).
 */
export default function ParcelFareBreakdown({ estimate, className = "" }) {
  if (!estimate) return null;
  const currency = estimate.currency === "$" ? "$" : estimate.currency || "$";

  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className}`}>
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm font-inter text-foreground-muted">Delivery Fee</Text>
        <Text className="text-sm font-inter-medium text-foreground">
          {currency}{estimate.deliveryFee?.toFixed?.(2) ?? estimate.deliveryFee}
        </Text>
      </View>
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm font-inter text-foreground-muted">Service Fee</Text>
        <Text className="text-sm font-inter-medium text-foreground">
          {currency}{estimate.serviceFee?.toFixed?.(2) ?? estimate.serviceFee}
        </Text>
      </View>
      {estimate.additionalFee > 0 && (
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm font-inter text-foreground-muted">Additional Fee</Text>
          <Text className="text-sm font-inter-medium text-foreground">
            {currency}{estimate.additionalFee?.toFixed?.(2) ?? estimate.additionalFee}
          </Text>
        </View>
      )}
      <View className="mt-1 flex-row justify-between border-t border-border pt-3">
        <Text className="text-base font-inter-bold text-foreground">Estimated Total</Text>
        <Text className="text-base font-inter-bold text-foreground">
          {currency}{estimate.fare?.toFixed?.(2) ?? estimate.fare}
        </Text>
      </View>
    </View>
  );
}
