// @/config/gigJobs/index.js
// Central registry for all Gig Job services. Add a new service by dropping a
// config file next to lawnMowing.js and wiring it into GIG_SERVICES + GIG_CATEGORIES.
// GigCategoriesScreen / GigCategoryCard / GigQuestionScreen all read from here —
// none of them should ever import a service config directly.

// import lawnMowing from "./lawnMowing";
import lawnMowing from "@/config/gigJobs/lawnMowing";

// icon = MaterialCommunityIcons name (these render via the shared Icon component
// used across Button/ListRow/ScreenHeader — NOT the fixed SvgIcon icon set, which
// doesn't have enough entries to cover all gig categories).
export const GIG_CATEGORIES = [
  { id: "hospitality", title: "Hospitality Shifts", icon: "silverware-fork-knife" },
  { id: "warehouse", title: "Warehouse Shifts", icon: "warehouse" },
  { id: "delivery-parcel", title: "Delivery / Parcel Jobs", icon: "truck-delivery-outline" },
  { id: "cleaning", title: "Cleaning", icon: "broom" },
  { id: "moving", title: "Moving / Removals", icon: "truck-outline" },
  { id: "construction", title: "Construction / Manual Labour", icon: "hammer-wrench" },
  { id: "retail", title: "Retail / Merchandising", icon: "storefront-outline" },
  { id: "events", title: "Events", icon: "calendar-star" },
  { id: "aged-care", title: "Aged Care / Personal Assistance", icon: "hand-heart-outline" },
  { id: "farm", title: "Farm / Horticulture Work", icon: "tractor-variant" },
  { id: "tutoring", title: "Tutoring", icon: "book-open-variant" },
  { id: "administration", title: "Administration", icon: "clipboard-text-outline" },
  { id: "professional-it", title: "Professional / IT Tasks", icon: "laptop" },
  { id: "household", title: "Local Household Tasks", icon: "home-city-outline" },
  { id: "lawn-mowing", title: "Lawn Mowing", icon: "grass" },
];

// Only categories with a real question-flow config are selectable today.
// Categories not yet in GIG_SERVICES should fall back to a "Coming soon" alert
// in GigCategoriesScreen, same as ServiceCard currently does for the whole tile.
export const GIG_SERVICES = {
  "lawn-mowing": lawnMowing,
};

export const getGigService = (serviceId) => GIG_SERVICES[serviceId] || null;
