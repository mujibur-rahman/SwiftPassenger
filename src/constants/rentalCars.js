// Car Rental — Australia (AUD)
// Images: local assets (offline-safe). remoteImage kept for API/booking payload.

export const CURRENCY = "A$";
export const CURRENCY_CODE = "AUD";

export const RENTAL_CARS = [
  {
    id: "rc1",
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    year: 2023,
    image: require("@assets/images/rental/toyota-small.jpg"),
    images: [require("@assets/images/rental/toyota-large.jpg")],
    remoteImage:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
    pricePerDay: 55,
    category: "Economy",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.8,
    reviewCount: 124,
    features: ["AC", "Bluetooth", "Rear Camera", "ABS", "Airbags"],
    available: true,
  },
  {
    id: "rc2",
    name: "Honda CR-V",
    brand: "Honda",
    model: "CR-V",
    year: 2022,
    image: require("@assets/images/rental/honda-small.jpg"),
    images: [require("@assets/images/rental/honda-large.jpg")],
    remoteImage:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600",
    pricePerDay: 89,
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.9,
    reviewCount: 89,
    features: ["AC", "Bluetooth", "Sunroof", "4WD", "Cruise Control"],
    available: true,
  },
  {
    id: "rc3",
    name: "BMW 5 Series",
    brand: "BMW",
    model: "5 Series",
    year: 2024,
    image: require("@assets/images/rental/bmw5-small.jpg"),
    images: [require("@assets/images/rental/bmw5-large.jpg")],
    remoteImage:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600",
    pricePerDay: 195,
    category: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.7,
    reviewCount: 56,
    features: ["AC", "Leather", "Premium Sound", "Navigation", "Sunroof"],
    available: true,
  },
  {
    id: "rc4",
    name: "Suzuki Swift",
    brand: "Suzuki",
    model: "Swift",
    year: 2023,
    image: require("@assets/images/rental/suzuki-small.jpg"),
    images: [require("@assets/images/rental/suzuki-large.jpg")],
    remoteImage:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600",
    pricePerDay: 45,
    category: "Economy",
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.5,
    reviewCount: 210,
    features: ["AC", "Bluetooth", "Power Steering"],
    available: true,
  },
  {
    id: "rc5",
    name: "Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    image: require("@assets/images/rental/tesla-small.jpg"),
    images: [require("@assets/images/rental/tesla-large.jpg")],
    remoteImage:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600",
    pricePerDay: 145,
    category: "Electric",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    rating: 4.9,
    reviewCount: 42,
    features: ["Autopilot", "Premium Audio", "Glass Roof", "Fast Charging"],
    available: true,
  },
  {
    id: "rc6",
    name: "Toyota Hilux",
    brand: "Toyota",
    model: "Hilux",
    year: 2022,
    image: require("@assets/images/rental/toyota-hilux-small.jpg"),
    images: [require("@assets/images/rental/toyota-hilux-large.jpg")],
    remoteImage:
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600",
    pricePerDay: 99,
    category: "SUV",
    seats: 5,
    transmission: "Manual",
    fuel: "Diesel",
    rating: 4.6,
    reviewCount: 78,
    features: ["4WD", "AC", "Tow Package", "Bed Liner"],
    available: true,
  },
];

export const RENTAL_LOCAL_IMAGES = {
  rc1: {
    image: require("@assets/images/rental/toyota-small.jpg"),
    images: [require("@assets/images/rental/toyota-large.jpg")],
  },
  rc2: {
    image: require("@assets/images/rental/honda-small.jpg"),
    images: [require("@assets/images/rental/honda-large.jpg")],
  },
  rc3: {
    image: require("@assets/images/rental/bmw5-small.jpg"),
    images: [require("@assets/images/rental/bmw5-large.jpg")],
  },
  rc4: {
    image: require("@assets/images/rental/suzuki-small.jpg"),
    images: [require("@assets/images/rental/suzuki-large.jpg")],
  },
  rc5: {
    image: require("@assets/images/rental/tesla-small.jpg"),
    images: [require("@assets/images/rental/tesla-large.jpg")],
  },
  rc6: {
    image: require("@assets/images/rental/toyota-hilux-small.jpg"),
    images: [require("@assets/images/rental/toyota-hilux-large.jpg")],
  },
};

export function withLocalImages(car) {
  if (!car?.id) return car;
  const local = RENTAL_LOCAL_IMAGES[car.id];
  if (!local) return car;
  return {
    ...car,
    image: local.image,
    images: local.images,
    remoteImage: typeof car.image === "string" ? car.image : car.remoteImage,
  };
}

export const RENTAL_CATEGORIES = [
  { id: "all", label: "All", icon: "car" },
  { id: "Economy", label: "Economy", icon: "car" },
  { id: "SUV", label: "SUV", icon: "car-estate" },
  { id: "Luxury", label: "Luxury", icon: "car-sports" },
  { id: "Electric", label: "Electric", icon: "car-electric" },
];

/** Add-on prices in AUD per day */
export const RENTAL_ADDONS = [
  {
    id: "extra_driver",
    name: "Extra Driver",
    price: 15,
    description: "Add one additional authorised driver",
  },
  {
    id: "child_seat",
    name: "Child Seat",
    price: 12,
    description: "Safety seat for children (0–4 years)",
  },
  {
    id: "gps",
    name: "GPS Navigation",
    price: 8,
    description: "Portable GPS device",
  },
  {
    id: "full_insurance",
    name: "Full Coverage Insurance",
    price: 35,
    description: "Reduced excess / comprehensive protection",
  },
  {
    id: "wifi",
    name: "Mobile Wi-Fi",
    price: 10,
    description: "Portable 4G hotspot",
  },
];

/** Australian payment methods */
export const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "credit-card-outline" },
  { id: "apple_pay", label: "Apple Pay", icon: "apple" },
  { id: "google_pay", label: "Google Pay", icon: "google" },
  { id: "paypal", label: "PayPal", icon: "paypal" },
  { id: "cash", label: "Cash on Pickup", icon: "cash" },
];
