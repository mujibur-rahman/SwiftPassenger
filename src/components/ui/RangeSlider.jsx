// @/components/ui/RangeSlider.jsx
import React, { useRef, useState } from "react";
import { View, Text, PanResponder } from "react-native";
import { useTheme } from "@/theme";

const THUMB = 20;

/**
 * Single-thumb slider, built on core PanResponder — no
 * @react-native-community/slider dependency to add. Track width is
 * measured on layout; thumb position is derived from value, drag updates
 * value from gesture dx. Supports tap-anywhere-on-track too.
 *
 * Props: min, max, step, value, onChange(number), formatLabel(value)
 */
export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = min,
  onChange,
  formatLabel,
}) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const track = colors?.border ?? (isDark ? "#1E3A5F" : "#BAE6FD");

  const [trackWidth, setTrackWidth] = useState(0);
  const widthRef = useRef(0);
  const valueRef = useRef(value);
  valueRef.current = value;

  const clamp = (v) => Math.min(max, Math.max(min, v));
  const snap = (v) => clamp(Math.round(v / step) * step);

  const xToValue = (x) => {
    const w = widthRef.current;
    if (w <= 0) return valueRef.current;
    const ratio = clamp(x) / w;
    return snap(min + ratio * (max - min));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        onChange?.(xToValue(evt.nativeEvent.locationX));
      },
      onPanResponderMove: (evt) => {
        onChange?.(xToValue(evt.nativeEvent.locationX));
      },
    })
  ).current;

  const ratio = max > min ? (clamp(value) - min) / (max - min) : 0;
  const thumbLeft = trackWidth > 0 ? ratio * trackWidth - THUMB / 2 : -THUMB / 2;

  return (
    <View>
      <View
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          widthRef.current = w;
          setTrackWidth(w);
        }}
        {...panResponder.panHandlers}
        style={{ height: 32, justifyContent: "center" }}
      >
        <View style={{ height: 4, borderRadius: 2, backgroundColor: track, overflow: "hidden" }}>
          <View style={{ width: `${ratio * 100}%`, height: "100%", backgroundColor: primary }} />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: thumbLeft,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: primary,
            borderWidth: 3,
            borderColor: isDark ? "#0D1E32" : "#FFFFFF",
          }}
        />
      </View>
      <View className="mt-1.5 flex-row justify-between">
        <Text className="text-[11px] font-inter text-foreground-muted">
          {formatLabel ? formatLabel(min) : min}
        </Text>
        <Text className="text-[11px] font-inter text-foreground-muted">
          {formatLabel ? formatLabel(max) : max}
        </Text>
      </View>
    </View>
  );
}
