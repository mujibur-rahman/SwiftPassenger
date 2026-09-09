// @/components/gig/BookingSummaryCard.jsx
// Same row style as JobSummaryCard (imports SummaryRow directly) but adds
// provider + price rows on top of the answer rows, for ConfirmBookingScreen.
import React from "react";
import { View, Text } from "react-native";
import { getGigService } from "@/config/gigJobs";
import { SummaryRow } from "@/components/gig/JobSummaryCard";

function humanizeId(id = "") {
  const withSpaces = id.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export default function BookingSummaryCard({
  serviceId,
  answers = {},
  provider,
  price,
  className = "",
}) {
  const service = getGigService(serviceId);

  const answerRows = Object.entries(answers).map(([questionId, optionId]) => {
    const question = service?.questions?.find((q) => q.id === questionId);
    const option = question?.options?.find((o) => o.id === optionId);
    return { label: humanizeId(questionId), value: option?.label || optionId };
  });

  const rows = [
    { label: "Service", value: service?.title },
    ...answerRows,
    { label: "Provider", value: provider },
    { label: "Price", value: price != null ? `$${Number(price).toFixed(2)}` : undefined },
  ].filter((r) => r.value);

  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className}`}>
      <Text className="mb-2 text-lg font-inter-bold text-foreground">Confirm your booking</Text>
      {rows.map((row, i) => (
        <SummaryRow
          key={row.label}
          label={row.label}
          value={row.value}
          isLast={i === rows.length - 1}
        />
      ))}
    </View>
  );
}
