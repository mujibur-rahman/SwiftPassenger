// @/components/gig/JobSummaryCard.jsx
// Renders serviceId + answers as a labeled list: "Lawn Size: Small — Courtyard / unit yard".
// Looks up question/option labels from the gigJobs config (read-only, no Redux inside).
// Exports SummaryRow so BookingSummaryCard can reuse the exact same row style.
import React from "react";
import { View, Text } from "react-native";
import { getGigService } from "@/config/gigJobs";

// lawnSize -> "Lawn Size", frequency -> "Frequency"
function humanizeId(id = "") {
  const withSpaces = id.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export function SummaryRow({ label, value, isLast = false, className = "" }) {
  if (!value) return null;
  return (
    <View
      className={`flex-row items-start justify-between py-2.5 ${!isLast ? "border-b border-border" : ""} ${className}`}
    >
      <Text className="text-xs font-inter-medium text-foreground-muted">{label}</Text>
      <Text className="ml-3 flex-1 text-right text-sm font-inter-semibold text-foreground">
        {value}
      </Text>
    </View>
  );
}

export default function JobSummaryCard({
  serviceId,
  answers = {},
  title,
  className = "",
}) {
  const service = getGigService(serviceId);

  const rows = Object.entries(answers).map(([questionId, optionId]) => {
    const question = service?.questions?.find((q) => q.id === questionId);
    const option = question?.options?.find((o) => o.id === optionId);
    return { label: humanizeId(questionId), value: option?.label || optionId };
  });

  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className}`}>
      <Text className="mb-2 text-lg font-inter-bold text-foreground">
        {title || service?.title || "Job Summary"}
      </Text>
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
