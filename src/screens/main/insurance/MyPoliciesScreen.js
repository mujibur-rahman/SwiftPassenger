import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity, RefreshControl } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  selectInsurancePolicies,
  setPolicies,
} from "@/features/insurance/insuranceSlice";
import { useGetMyPoliciesQuery } from "@/features/insurance/insuranceApi";

export default function MyPoliciesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");

  const localPolicies = useSelector(selectInsurancePolicies);
  const { data, isFetching, refetch } = useGetMyPoliciesQuery(undefined, {
    // keep local policies if API fails
  });

  useEffect(() => {
    if (data?.length) {
      dispatch(setPolicies(data));
    }
  }, [data, dispatch]);

  const policies = localPolicies?.length ? localPolicies : data || [];

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="My Policies" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          flexGrow: policies.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {policies.length === 0 ? (
          <View className="flex-1 items-center justify-center py-16">
            <Icon name="file-document-outline" size={48} color={muted} />
            <Text className="mt-3 text-base font-inter-semibold text-foreground">
              No policies yet
            </Text>
            <Text className="mt-1 mb-6 text-center text-sm font-inter text-foreground-muted">
              Buy your first car insurance policy in a few minutes.
            </Text>
            <Button onPress={() => navigation.navigate("VehicleDetails")}>
              Get New Policy
            </Button>
          </View>
        ) : (
          policies.map((p) => {
            const v = p.vehicle || {};
            return (
              <View
                key={p.id || p.policyNumber}
                className="mb-3 rounded-2xl border border-border bg-card p-4"
              >
                <View className="mb-2 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-[15px] font-inter-bold text-foreground">
                      {v.brand} {v.model}
                    </Text>
                    <Text className="text-xs font-inter text-foreground-muted">
                      {v.registrationNumber}
                    </Text>
                  </View>
                  <View className="rounded-full bg-success/15 px-2.5 py-1">
                    <Text className="text-[11px] font-inter-semibold" style={{ color: success }}>
                      Active
                    </Text>
                  </View>
                </View>

                <Text className="mb-3 text-xs font-inter text-foreground-muted">
                  {p.policyNumber} · Expires {formatDate(p.expiresAt)}
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ClaimType", { policyId: p.id, policyNumber: p.policyNumber })
                    }
                    className="flex-1 items-center rounded-xl border border-border py-2.5"
                  >
                    <Text className="text-xs font-inter-semibold text-foreground">Claim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("VehicleDetails")}
                    className="flex-1 items-center rounded-xl border border-border py-2.5"
                  >
                    <Text className="text-xs font-inter-semibold text-foreground">Renew</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { }}
                    className="flex-1 items-center rounded-xl border border-border py-2.5"
                  >
                    <Text className="text-xs font-inter-semibold text-foreground">Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {policies.length > 0 && (
        <View
          className="border-t border-border bg-card px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Button variant="gradient" pill={true} onPress={() => navigation.navigate("VehicleDetails")}>
            Get Another Policy
          </Button>
        </View>
      )}
    </View>
  );
}
