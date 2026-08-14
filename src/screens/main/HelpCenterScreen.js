// src/screens/main/HelpCenterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import ScreenHeader from "../../components/ui/ScreenHeader";
import Button from "../../components/ui/Button";
import Expandable from "../../components/ui/Expandable";
import ExpandableGroup from "../../components/ui/ExpandableGroup";

const FAQS = [
  {
    category: "Booking",
    items: [
      {
        q: "How do I book a ride?",
        a: 'Tap "Where to?" on the home screen, enter your destination, choose your ride type and tap Book.',
      },
      {
        q: "Can I schedule a ride in advance?",
        a: "Scheduled rides are coming soon. Currently all rides are on-demand.",
      },
      {
        q: "How do I cancel a ride?",
        a: 'On the active ride screen, tap "Cancel". Note that cancellation fees may apply after a driver is assigned.',
      },
    ],
  },
  {
    category: "Payment",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept credit/debit cards, the Swift Wallet, and cash (in select areas).",
      },
      {
        q: "How do I get a receipt?",
        a: "Receipts are sent to your email automatically after each trip.",
      },
      {
        q: "Why was I charged more than estimated?",
        a: "Final fare may differ due to route changes, waiting time, or surge pricing.",
      },
    ],
  },
  {
    category: "Safety",
    items: [
      {
        q: "How do I share my trip?",
        a: 'On the active ride screen, tap "Share Trip" to send your live location to a contact.',
      },
      {
        q: "What if I left something in the car?",
        a: "Contact your driver through the trip history or reach out to support.",
      },
      {
        q: "How do I report an issue?",
        a: "Go to Activity → select the trip → Report Issue, or contact support below.",
      },
    ],
  },
];

export default function HelpCenterScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const allItems = FAQS.flatMap((c) =>
    c.items.map((item) => ({ ...item, category: c.category })),
  );

  const filtered = searchText
    ? allItems.filter((i) =>
        i.q.toLowerCase().includes(searchText.toLowerCase()),
      )
    : null;

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const contactSupport = () => {
    Alert.alert("Contact Support", "Choose how to reach us:", [
      {
        text: "Email",
        onPress: () => Linking.openURL("mailto:support@swiftride.com"),
      },
      {
        text: "Live Chat",
        onPress: () => Alert.alert("Live Chat", "Live chat coming soon!"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const FaqItem = ({ itemKey, question, answer, isLast }) => {
    const open = expandedId === itemKey;
    return (
      <View className={!isLast ? "border-b border-border" : ""}>
        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4"
          onPress={() => toggle(itemKey)}
          activeOpacity={0.7}
        >
          <Text className="mr-2 flex-1 text-[14px] font-sans-medium text-foreground">
            {question}
          </Text>
          <Icon
            name={open ? "chevron-up" : "chevron-down"}
            size={18}
            color="#7DD3FC"
          />
        </TouchableOpacity>
        {open && (
          <View className="px-4 pb-4 pt-0">
            <Text className="text-[13px] font-sans leading-5 text-foreground-muted">
              {answer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Help Center" className="px-5" />

      <ScrollView
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View className="mb-5 flex-row items-center gap-2.5 rounded-2xl border border-border bg-input px-4 h-[52px]">
          <Icon name="magnify" size={20} color="#7DD3FC" />
          <TextInput
            className="flex-1 p-0 text-[15px] font-sans text-foreground"
            placeholder="Search help articles..."
            placeholderTextColor="#7DD3FC"
            value={searchText}
            onChangeText={setSearchText}
            selectionColor="#38BDF8"
            cursorColor="#38BDF8"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} hitSlop={8}>
              <Icon name="close-circle" size={18} color="#7DD3FC" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick contact */}
        <View className="mb-6 flex-row gap-2.5">
          {[
            {
              icon: "chat-outline",
              label: "Live Chat",
              onPress: contactSupport,
            },
            {
              icon: "email-outline",
              label: "Email Us",
              onPress: () =>
                Linking.openURL("mailto:support@swiftride.com"),
            },
            {
              icon: "phone-outline",
              label: "Call Us",
              onPress: () => Linking.openURL("tel:+1800SWIFT"),
            },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.label}
              className="flex-1 items-center gap-2 rounded-2xl border border-border bg-card p-4"
              onPress={opt.onPress}
              activeOpacity={0.7}
            >
              <Icon name={opt.icon} size={22} color="#38BDF8" />
              <Text className="text-xs font-sans-medium text-foreground-secondary">
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section title */}
        <Text className="mb-3 text-xs font-sans-semibold tracking-wide text-foreground-muted">
          {filtered
            ? `${filtered.length} results for "${searchText}"`
            : "Frequently Asked Questions"}
        </Text>

        {/* Search results */}
        {filtered ? (
          <View className="gap-2">
            {filtered.map((item, i) => (
              <View
                key={`${i}`}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <FaqItem
                  itemKey={`${i}`}
                  question={item.q}
                  answer={item.a}
                  isLast
                />
              </View>
            ))}
            {filtered.length === 0 && (
              <Text className="py-8 text-center text-[15px] font-sans text-foreground-muted">
                No results found
              </Text>
            )}
          </View>
        ) : (
          /* Grouped FAQs */
          FAQS.map((section, si) => (
            <ExpandableGroup key={section.category} title={section.category}>
    {section.items.map((item, idx) => {
      const key = `${si}-${idx}`;
      return (
        <Expandable
          key={key}
          title={item.q}
          expanded={expandedId === key}
          onToggle={(open) => setExpandedId(open ? key : null)}
          isLast={idx === section.items.length - 1}
        >
          {item.a}
        </Expandable>
      );
    })}
  </ExpandableGroup>
          ))
        )}

        {/* Still need help */}
        <View className="mt-2 items-center gap-2 rounded-2xl border border-border bg-card p-5">
          <Text className="text-base font-sans-bold text-foreground">
            Still need help?
          </Text>
          <Text className="text-[13px] font-sans text-foreground-muted">
            Our support team is available 24/7
          </Text>
          <View className="mt-2 w-full">
            <Button variant="primary" onPress={contactSupport}>
              Contact Support
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}