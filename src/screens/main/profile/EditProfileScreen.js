// src/screens/main/EditProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import AppTextInput from "@/components/ui/AppTextInput";
import Button from "@/components/ui/Button";
import { userLoggedIn } from "@/features/auth/authSlice";
import { apiSlice } from "@/features/api/apiSlice";
import ScreenHeader from "@/components/ui/ScreenHeader";
import AvatarPicker from "@/components/ui/AvatarPicker";

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((s) => s.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUri, setAvatarUri] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  // ── Image Picker ──────────────────────────────────────────────
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photos to change the profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow camera access to take a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("Change Photo", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = user?.avatar;

      // Upload new avatar if selected (local file)
      if (
        avatarUri &&
        avatarUri !== user?.avatar &&
        !avatarUri.startsWith("http")
      ) {
        const formData = new FormData();
        const filename = avatarUri.split("/").pop() || "avatar.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("avatar", {
          uri: avatarUri,
          name: filename,
          type,
        });

        // Adjust endpoint to match your backend
        const uploadRes = await apiSlice.patch(
          "/passengers/me/avatar",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        avatarUrl =
          uploadRes?.data?.avatar || uploadRes?.data?.url || avatarUri;
      }

      // Update profile fields
      await apiSlice.patch("/passengers/me", {
        name: name.trim(),
        email: email.trim(),
      });

      const updatedUser = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        avatar: avatarUrl,
      };

      dispatch(
        userLoggedIn({
          accessToken,
          user: updatedUser,
        }),
      );

      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log("Update error →", e);
      Alert.alert(
        "Error",
        e?.response?.data?.detail ||
          e?.data?.message ||
          "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-5 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="Edit Profile" className="mb-4" />

          <AvatarPicker
            name={name || user?.name}
            uri={avatarUri}
            size={90}
            loading={loading}
            onPress={handleChangePhoto}
            className="mb-8"
          />

          {/* Form */}
          <View className="gap-4">
            <AppTextInput
              label="Full Name"
              required
              leftIcon="user"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              autoCapitalize="words"
            />

            <AppTextInput
              label="Email (optional)"
              leftIcon="mail"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View>
              <AppTextInput
                label="Phone Number"
                leftContent="+1"
                value={user?.phone || ""}
                editable={false}
                disabled
                rightContent={
                  <View className="flex-row items-center gap-1 rounded-lg bg-background-muted px-2 py-1">
                    <Icon name="lock" size={12} color="#7DD3FC" />
                    <Text className="text-[11px] font-sans text-foreground-muted">
                      Locked
                    </Text>
                  </View>
                }
              />
              <Text className="mt-1.5 text-xs font-sans text-foreground-muted">
                Phone number cannot be changed
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-8 gap-3">
            <Button
              variant="primary"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
            >
              Save Changes
            </Button>

            <Button
              variant="outline"
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              Cancel
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
