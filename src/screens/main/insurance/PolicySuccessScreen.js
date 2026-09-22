import React from "react";
import { View, Text, StatusBar, Share, Alert } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";

export default function PolicySuccessScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const policy = route?.params?.policy;

  const policyNumber = policy?.policyNumber || "POL-2026-000000";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My car insurance policy ${policyNumber} is now active.`,
      });
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    Alert.alert("Download", "Policy PDF will be available after backend integration.");
  };

  return (
    <View
      className="flex-1 bg-background items-center justify-center px-6"
      style={{ paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-success/15">
        <Icon name="check-circle" size={48} color={success} />
      </View>

      <Text className="mb-2 text-center text-xl font-inter-bold text-foreground">
        Policy issued successfully!
      </Text>
      <Text className="mb-1 text-center text-sm font-inter text-foreground-muted">
        Your policy number
      </Text>
      <Text className="mb-8 text-center text-lg font-inter-bold text-primary">
        {policyNumber}
      </Text>

      <View className="w-full">
        <Button variant="gradient" pill={true} onPress={handleDownload} className="mb-3">
          Download Policy PDF
        </Button>
        <Button variant="secondary" pill={true} onPress={() => navigation.replace("MyPolicies")} className="mb-3">
          View My Policies
        </Button>
        <Button variant="ghost" onPress={handleShare}>
          Share
        </Button>
      </View>
    </View>
  );
}
