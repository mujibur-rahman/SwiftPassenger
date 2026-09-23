export const INSURANCE_TYPES = [
  {
    id: "ctp",
    title: "Compulsory Third Party (CTP)",
    shortTitle: "Compulsory Third Party",
    icon: "shield-check-outline",
    accent: "primary",
    description: "Cover for injury or death caused to other people in a road accident.",
    benefits: ["Injury protection for other people", "Meets compulsory road requirements", "Simple annual policy"],
    exclusions: ["Damage to your own vehicle", "Damage to another person's property"],
  },
  {
    id: "third_party_property",
    title: "Third Party Property",
    shortTitle: "Third Party Property",
    icon: "car-multiple",
    accent: "primary",
    description: "Protection when your vehicle causes damage to another person's vehicle or property.",
    benefits: ["Third-party property damage", "Protection against eligible liability costs", "Affordable basic cover"],
    exclusions: ["Damage to your own vehicle", "Fire and theft of your vehicle"],
  },
  {
    id: "third_party_fire_theft",
    title: "Third Party Fire & Theft",
    shortTitle: "Third Party Fire & Theft",
    icon: "fire-alert",
    accent: "primary",
    description: "Third-party property protection plus selected cover for fire and theft of your vehicle.",
    benefits: ["Third-party property damage", "Vehicle theft protection", "Vehicle fire protection"],
    exclusions: ["Most accidental damage to your own vehicle", "Normal wear and tear"],
  },
  {
    id: "comprehensive",
    title: "Comprehensive",
    shortTitle: "Comprehensive",
    icon: "shield-car",
    accent: "primary",
    description: "Broader protection for your vehicle, third parties, fire, theft and eligible accidental damage.",
    benefits: ["Own vehicle damage", "Third-party property protection", "Fire and theft protection", "Optional add-ons"],
    exclusions: ["Normal wear and tear", "Mechanical breakdown unless specifically covered"],
  },
];

export const getInsuranceType = (typeId) =>
  INSURANCE_TYPES.find((item) => item.id === typeId) || INSURANCE_TYPES[3];
