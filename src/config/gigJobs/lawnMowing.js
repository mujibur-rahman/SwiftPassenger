// @/config/gigJobs/lawnMowing.js
// Data-driven question config for the Lawn Mowing gig service.
// Consumed by GigQuestionScreen — do not hardcode this shape into any screen.

export default {
  id: "lawn-mowing",
  title: "Lawn Mowing",
  icon: "grass", // MaterialCommunityIcons name
  questions: [
    {
      id: "lawnSize",
      question: "How big is the lawn area that needs mowing?",
      options: [
        { id: "small", label: "Small — Courtyard / unit yard" },
        { id: "standard", label: "Standard suburban yard" },
        { id: "large", label: "Large yard / big block" },
        { id: "acreage", label: "Acreage / rural" },
      ],
    },
    {
      id: "frequency",
      question: "Is this a one-off mow or would you like it done regularly?",
      options: [
        { id: "one_off", label: "One-off" },
        { id: "weekly", label: "Weekly" },
        { id: "fortnightly", label: "Fortnightly" },
        { id: "monthly", label: "Monthly" },
      ],
    },
    {
      id: "clippings",
      question: "What happens to the clippings?",
      options: [
        { id: "keep", label: "Keep on site" },
        { id: "take", label: "Take them away" },
      ],
    },
    {
      id: "timing",
      question: "When are you looking to get this done?",
      options: [
        { id: "asap", label: "ASAP" },
        { id: "2_weeks", label: "Within 2 weeks" },
        { id: "1_month", label: "Within a month" },
        { id: "researching", label: "Just researching" },
      ],
    },
  ],
};
