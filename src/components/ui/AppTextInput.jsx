import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SvgIcon from "./SvgIcon";
import { COLORS } from "../../constants/Colors";

const AppTextInput = forwardRef(
  (
    {
      label,
      required = false,
      error,

      // Left side
      leftIcon,
      leftContent,

      // Right side
      rightIcon,
      rightContent,

      onRightPress,

      containerStyle,
      inputStyle,

      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={containerStyle}>
        {/* Label */}
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            focused && styles.focused,
            error && styles.errorBorder,
          ]}
        >
          {/* Left Content / Icon */}
          {leftContent !== undefined && leftContent !== null ? (
            <View style={styles.leftContent}>
              {typeof leftContent === "string" ||
              typeof leftContent === "number" ? (
                <Text style={styles.leftContentText}>{leftContent}</Text>
              ) : (
                leftContent
              )}
            </View>
          ) : leftIcon ? (
            <View style={styles.leftContent}>
              <SvgIcon name={leftIcon} size={20} color={COLORS.placeholder} />
            </View>
          ) : null}

          {/* Input */}
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholderTextColor={COLORS.placeholder}
            selectionColor="#00D95F"
            cursorColor="#00D95F"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />

          {/* Right Content / Icon */}
          {rightContent ? (
            <View style={styles.rightContent}>
              <Text style={styles.leftContentText}>{rightContent}</Text>
            </View>
          ) : (
            rightIcon && (
              <TouchableOpacity
                style={styles.rightContent}
                onPress={onRightPress}
                activeOpacity={0.7}
              >
                <SvgIcon name={rightIcon} size={20} color={COLORS.placeholder} />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Error */}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

export default React.memo(AppTextInput);

const styles = StyleSheet.create({
  // container: {
  //   marginBottom: 16,
  // },

  label: {
    color: COLORS.subText,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.4,
  },

  required: {
    color: "#FF4D4F",
  },

  inputContainer: {
    height: 54,

    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",

    backgroundColor: "#161616",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
  },

  focused: {
    borderColor: "#00D95F",
  },

  errorBorder: {
    borderColor: "#FF4D4F",
  },

  leftContent: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  leftContentText: {
    color: COLORS.placeholder,
    fontSize: 15,
    fontWeight: "600",
  },

  rightContent: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1,

    color: "#FFF",
    fontSize: 15,

    height: "100%",
    paddingHorizontal: 0,
  },

  error: {
    marginTop: 5,
    color: "#FF4D4F",
    fontSize: 12,
  },
});
