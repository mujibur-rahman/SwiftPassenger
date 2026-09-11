// @/config/gigJobs/lawnMowing.js
// Data-driven question config for the Lawn Mowing gig service.
// Consumed by GigQuestionScreen — do not hardcode this shape into any screen.
//
// Each option keeps `label` (used by JobSummaryCard / ReviewJobScreen /
// BookingSummaryCard / JobPostedScreen for the plain-text summary rows) and
// adds `title` + `subtitle` + `image` for the photo-card grid UI. When an
// option has no photo asset yet, `image` is omitted and `icon`/`color`
// drive ImageOptionCard's fallback tile instead — see the `monthly` option
// below: frequency/monthly.jpg doesn't exist in assets yet, so it falls
// back to an icon tile until that file is added.

export default {
  id: "lawn-mowing",
  title: "Lawn Mowing",
  icon: "grass", // MaterialCommunityIcons name
  thumbnail: require("@assets/images/gigs/lawn_mowing/categories/lawn-mowing-thumb.jpg"),

  questions: [
    {
      id: "lawnSize",
      question: "How big is the lawn area that needs mowing?",
      imageAspectRatio: 1.3,
      options: [
        {
          id: "small",
          label: "Small — Courtyard / unit yard",
          title: "Small Yard",
          subtitle: "Courtyard / unit yard",
          image: require("@assets/images/gigs/lawn_mowing/sizes/small-yard.jpg"),
        },
        {
          id: "standard",
          label: "Standard suburban yard",
          title: "Standard Yard",
          subtitle: "Suburban yard",
          image: require("@assets/images/gigs/lawn_mowing/sizes/standard-yard.jpg"),
        },
        {
          id: "large",
          label: "Large yard / big block",
          title: "Large Yard",
          subtitle: "Big block",
          image: require("@assets/images/gigs/lawn_mowing/sizes/large-yard.jpg"),
        },
        {
          id: "acreage",
          label: "Acreage / rural",
          title: "Acreage / Rural",
          subtitle: "Large rural property",
          image: require("@assets/images/gigs/lawn_mowing/sizes/acreage-rural.jpg"),
        },
      ],
    },
    {
      id: "frequency",
      question: "Is this a one-off mow or would you like it done regularly?",
      imageAspectRatio: 1.3,
      options: [
        {
          id: "one_off",
          label: "One-off",
          title: "One-off",
          image: require("@assets/images/gigs/lawn_mowing/frequency/one-off.jpg"),
        },
        {
          id: "weekly",
          label: "Weekly",
          title: "Weekly",
          image: require("@assets/images/gigs/lawn_mowing/frequency/weekly.jpg"),
        },
        {
          id: "fortnightly",
          label: "Fortnightly",
          title: "Fortnightly",
          image: require("@assets/images/gigs/lawn_mowing/frequency/fortnightly.jpg"),
        },
        {
          id: "monthly",
          label: "Monthly",
          title: "Monthly",
          image: require("@assets/images/gigs/lawn_mowing/frequency/monthly.png"),
        },
      ],
    },
    {
      id: "clippings",
      question: "What happens to the clippings?",
      imageAspectRatio: 1,
      options: [
        {
          id: "keep",
          label: "Keep on site",
          title: "Keep on site",
          image: require("@assets/images/gigs/lawn_mowing/clippings/keep-on-site.png"),
        },
        {
          id: "take",
          label: "Take them away",
          title: "Take them away",
          image: require("@assets/images/gigs/lawn_mowing/clippings/take-away.png"),
        },
      ],
    },
    {
      id: "timing",
      question: "When are you looking to get this done?",
      imageAspectRatio: 1,
      options: [
        {
          id: "asap",
          label: "ASAP",
          title: "ASAP",
          image: require("@assets/images/gigs/lawn_mowing/timing/asap.png"),
        },
        {
          id: "2_weeks",
          label: "Within 2 weeks",
          title: "Within 2 weeks",
          image: require("@assets/images/gigs/lawn_mowing/timing/within-2-weeks.png"),
        },
        {
          id: "1_month",
          label: "Within a month",
          title: "Within a month",
          image: require("@assets/images/gigs/lawn_mowing/timing/within-a-month.png"),
        },
        {
          id: "researching",
          label: "Just researching",
          title: "Just researching",
          image: require("@assets/images/gigs/lawn_mowing/timing/just-researching.jpg"),
        },
      ],
    },
  ],
};
