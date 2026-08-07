import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";

const BrandBadge = ({
  text = "ZyroApp",
  size = 90,
  fontSize = 26,
  fontFamily = "InstrumentSerif",
  backgroundColor = COLORS.badge,
  textColor = COLORS.gold,
  borderColor = COLORS.border,
  style,
  textStyle,
}) => {
  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.brand,
          {
            fontSize,
            fontFamily,
            color: textColor,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontWeight: "600",
  },
});

export default BrandBadge;
