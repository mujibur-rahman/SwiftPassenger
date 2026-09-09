// @/components/gig/ContactDetailsForm.jsx
// Controlled form — parent (ContactDetailsScreen) owns state and passes
// values + onChange. No useSelector/useDispatch here so it stays reusable.
// Photo picker reuses the pickImage/takePhoto logic from EditProfileScreen,
// not AvatarPicker's circular-avatar UI (this needs a plain button, since a
// job can have multiple photos, not a single profile picture).
import React from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AppTextInput from "@/components/ui/AppTextInput";
import { useTheme } from "@/theme";

const FIELDS = [
  { key: "fullName", label: "Full Name", required: true },
  { key: "mobile", label: "Mobile Number", required: true, keyboardType: "phone-pad" },
  { key: "email", label: "Email Address", required: true, keyboardType: "email-address" },
  { key: "address", label: "Property Address", required: true },
  { key: "suburb", label: "Suburb", required: true },
  { key: "postcode", label: "Postcode", required: true, keyboardType: "number-pad" },
];

export default function ContactDetailsForm({
  values = {},
  onChange,
  errors = {},
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const photos = values.photos || [];

  const setField = (key, val) => onChange?.({ ...values, [key]: val });

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos to add lawn photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setField("photos", [...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (uri) => {
    setField(
      "photos",
      photos.filter((p) => p !== uri),
    );
  };

  return (
    <View className={className}>
      {FIELDS.map((field) => (
        <AppTextInput
          key={field.key}
          label={field.label}
          required={field.required}
          value={values[field.key] || ""}
          onChangeText={(text) => setField(field.key, text)}
          error={errors[field.key]}
          keyboardType={field.keyboardType}
          containerClassName="mb-4"
        />
      ))}

      <AppTextInput
        label="Additional instructions"
        placeholder="e.g. Please be careful around the garden beds."
        value={values.notes || ""}
        onChangeText={(text) => setField("notes", text)}
        multiline
        numberOfLines={3}
        containerClassName="mb-4"
      />

      <Text className="mb-1.5 text-sm font-inter-semibold tracking-wide text-foreground-secondary">
        Upload lawn photos
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {photos.map((uri) => (
          <View key={uri} className="relative">
            <Image source={{ uri }} style={{ width: 72, height: 72, borderRadius: 12 }} />
            <TouchableOpacity
              onPress={() => removePhoto(uri)}
              className="absolute -right-1.5 -top-1.5 h-5 w-5 items-center justify-center rounded-full bg-error"
            >
              <Icon name="close" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={pickPhoto}
          className="h-[72px] w-[72px] items-center justify-center rounded-xl border border-dashed border-primary/40 bg-card"
        >
          <Icon name="camera-plus-outline" size={22} color={primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
