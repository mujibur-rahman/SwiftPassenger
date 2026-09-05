// src/screens/main/ActivityScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetRideHistoryQuery } from "@/features/ride/rideApi";
import Badge from "@/components/ui/Badge";
import Heading from "@/components/ui/Heading";

const STATUS_VARIANT = {
  completed: "success",
  cancelled: "error",
  ongoing: "info",
  accepted: "primary",
};

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();

  const {
    data: history = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetRideHistoryQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const renderItem = ({ item }) => {
    const variant = STATUS_VARIANT[item.status] || "muted";

    return (
      <TouchableOpacity
        className="mb-3 rounded-2xl border border-border bg-card p-4"
        activeOpacity={0.7}
      >
        {/* Header */}
        <View className="mb-3.5 flex-row items-center justify-between">
          <Badge
            label={item.status || "unknown"}
            variant={variant}
            uppercase
            size="md"
          />
          <Text className="text-[13px] font-inter text-foreground-muted">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "—"}
          </Text>
        </View>

        {/* Route */}
        <View className="mb-3.5 flex-row gap-2.5">
          <View className="items-center gap-1 pt-0.5">
            <View className="h-2.5 w-2.5 rounded-full bg-success" />
            <View className="w-0.5 flex-1 bg-border" />
            <View className="h-2.5 w-2.5 rounded-full bg-error" />
          </View>
          <View className="flex-1 gap-3">
            <Text
              className="text-[13px] font-inter text-foreground-secondary"
              numberOfLines={1}
            >
              {item.pickupAddress || "Pickup"}
            </Text>
            <Text
              className="text-[13px] font-inter text-foreground-secondary"
              numberOfLines={1}
            >
              {item.destinationAddress || "Destination"}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center gap-3 border-t border-border pt-3">
          <View className="flex-row items-center gap-1">
            <Icon name="clock-outline" size={14} color="#7DD3FC" />
            <Text className="text-xs font-inter text-foreground-muted">
              {item.duration || "12 min"}
            </Text>
          </View>
          <Text className="ml-auto text-base font-inter-bold text-primary">
            ${Number(item.fare ?? 14.5).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pb-4" style={{ paddingTop: insets.top + 16 }}>
        <Heading
          title="Your Rides"
          subtitle={`${history.length} trips total`}
          size="lg"
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="px-4 pb-28"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#38BDF8"
              colors={["#38BDF8"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center gap-2 pt-20">
              <Text className="text-5xl">🚗</Text>
              <Text className="text-lg font-inter-semibold text-foreground">
                No rides yet
              </Text>
              <Text className="text-sm font-inter text-foreground-muted">
                Your trip history will show up here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
