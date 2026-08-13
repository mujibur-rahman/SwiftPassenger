// src/components/LocationAutocomplete.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { autocompletePlaces, getPlaceDetails } from "../services/places";

export default function LocationAutocomplete({
  label,
  value,
  onChangeText,
  onSelect, // ({ latitude, longitude, address }) => void
  placeholder = "Search location",
  biasCoords, // { latitude, longitude }
  containerClassName = "",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const fetchSuggestions = (text) => {
    if (timer.current) clearTimeout(timer.current);

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const list = await autocompletePlaces(text, {
          lat: biasCoords?.latitude,
          lng: biasCoords?.longitude,
        });
        setSuggestions(list);
      } catch (e) {
        console.log("Autocomplete error:", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350); // debounce
  };

  const handleChange = (text) => {
    onChangeText?.(text);
    fetchSuggestions(text);
  };

  const handleSelect = async (item) => {
    Keyboard.dismiss();
    setSuggestions([]);
    setLoading(true);

    try {
      const details = await getPlaceDetails(item.placeId);
      onChangeText?.(details.address);
      onSelect?.(details);
    } catch (e) {
      // fallback: just use description
      onChangeText?.(item.description);
      console.warn("Place details failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`relative ${containerClassName}`}>
      {label ? (
        <Text className="mb-1.5 text-xs font-sans-semibold text-foreground-muted">
          {label}
        </Text>
      ) : null}

      <View
        className={`
          flex-row items-center h-12 bg-input border rounded-xl px-3
          ${focused ? "border-ring" : "border-border"}
        `}
      >
        <Icon name="map-marker" size={18} color="#7DD3FC" />
        <TextInput
          className="flex-1 ml-2 h-full p-0 text-base font-sans text-foreground"
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#7DD3FC"
          selectionColor="#38BDF8"
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // small delay so tap on suggestion works
            setTimeout(() => setFocused(false), 200);
          }}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {loading ? (
          <ActivityIndicator size="small" color="#38BDF8" />
        ) : value ? (
          <TouchableOpacity
            onPress={() => {
              onChangeText?.("");
              setSuggestions([]);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="close-circle" size={18} color="#7DD3FC" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Suggestions dropdown */}
      {focused && suggestions.length > 0 && (
        <View className="absolute left-0 right-0 top-13 z-50 bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.placeId}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 px-3.5 py-3 border-b border-border/60"
            >
              <View className="size-8 rounded-full bg-background-muted items-center justify-center">
                <Icon name="map-marker-outline" size={16} color="#38BDF8" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-sm font-sans-semibold text-foreground"
                  numberOfLines={1}
                >
                  {item.mainText}
                </Text>
                {item.secondaryText ? (
                  <Text
                    className="text-xs font-sans text-foreground-muted mt-0.5"
                    numberOfLines={1}
                  >
                    {item.secondaryText}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
