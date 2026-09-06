// src/components/ui/LogoAvatar.jsx
import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Avatar from "@/components/ui/Avatar";
import Greeting from "@/components/ui/Greeting";

export default function LogoAvatar({
  appName = "ZyroApp",
  name = "Passenger",
  subtitle,
  showGreeting = true,
  avatarUri,
  onAvatarPress,
  profileRoute = "Profile",
  className = "",
  useLogoAvatarClass = true,
  titleClassName = "",
  rightContent,
  children,
}) {
  const navigation = useNavigation();
  const { user } = useSelector((s) => s.auth);

  const handleAvatarPress =
    onAvatarPress ??
    (() => {
      if (profileRoute) navigation.navigate(profileRoute);
    });

  const rootClass = [useLogoAvatarClass ? "logo-avatar" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <View className={rootClass}>
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-[26px] font-instrument-italic font-semibold text-primary ${titleClassName}`}
        >
          {appName}
        </Text>

        {rightContent ?? (
          <Avatar name={user?.name || name} uri={avatarUri} onPress={handleAvatarPress} />
        )}
      </View>

      {showGreeting ? <Greeting name={user?.name || name} subtitle={subtitle} /> : null}

      {children}
    </View>
  );
}
