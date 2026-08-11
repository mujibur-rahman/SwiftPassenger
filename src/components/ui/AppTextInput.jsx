import React, { forwardRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import SvgIcon from "./SvgIcon";

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

      containerStyle, // can still accept className string
      inputStyle, // can still accept className string

      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View className={containerStyle}>
        {/* Label */}
        {label && (
          <Text className="text-muted-foreground text-sm font-sans-semibold mb-1.5 tracking-wide">
            {label}
            {required && <Text className="text-danger"> *</Text>}
          </Text>
        )}

        {/* Input Container */}
        <View
          className={`
            h-13.5 rounded-2xl border flex-row items-center px-3.5
            bg-card border-border
            ${focused ? "border-primary" : ""}
            ${error ? "border-danger" : ""}
          `}
        >
          {/* Left Content / Icon */}
          {leftContent !== undefined && leftContent !== null ? (
            <View className="mr-2.5 justify-center items-center">
              {typeof leftContent === "string" ||
              typeof leftContent === "number" ? (
                <Text className="text-muted-foreground text-base font-sans-semibold">
                  {leftContent}
                </Text>
              ) : (
                leftContent
              )}
            </View>
          ) : leftIcon ? (
            <View className="mr-2.5 justify-center items-center">
              <SvgIcon name={leftIcon} size={20} color="#A1A1A1" />
            </View>
          ) : null}

          {/* Input */}
          <TextInput
            ref={ref}
            className={`
              flex-1 text-foreground font-sans text-base h-full p-0
              ${inputStyle || ""}
            `}
            placeholderTextColor="#A1A1A1"
            selectionColor="#CBA35C"
            cursorColor="#CBA35C"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />

          {/* Right Content / Icon */}
          {rightContent ? (
            <View className="ml-2.5 justify-center items-center">
              <Text className="text-muted-foreground text-base font-sans-semibold">
                {rightContent}
              </Text>
            </View>
          ) : (
            rightIcon && (
              <TouchableOpacity
                className="ml-2.5 justify-center items-center"
                onPress={onRightPress}
                activeOpacity={0.7}
              >
                <SvgIcon name={rightIcon} size={20} color="#A1A1A1" />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Error */}
        {!!error && <Text className="mt-1.5 text-danger text-xs">{error}</Text>}
      </View>
    );
  },
);

export default React.memo(AppTextInput);
