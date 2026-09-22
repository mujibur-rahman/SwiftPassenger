// Dummy car inventory for Car Rental feature
export const RENTAL_CARS = [
  {
    id: "rc1",
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800",
    ],
    pricePerDay: 3500,
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
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    ],
    pricePerDay: 5500,
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
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad094?w=600",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad094?w=800",
    ],
    pricePerDay: 12000,
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
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800",
    ],
    pricePerDay: 2800,
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
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    ],
    pricePerDay: 15000,
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
    image:
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600",
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800",
    ],
    pricePerDay: 6500,
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

export const RENTAL_CATEGORIES = [
  { id: "all", label: "All", icon: "car" },
  { id: "Economy", label: "Economy", icon: "car" },
  { id: "SUV", label: "SUV", icon: "car-estate" },
  { id: "Luxury", label: "Luxury", icon: "car-sports" },
  { id: "Electric", label: "Electric", icon: "car-electric" },
];

export const RENTAL_ADDONS = [
  {
    id: "extra_driver",
    name: "Extra Driver",
    price: 500,
    description: "Add one additional authorized driver",
  },
  {
    id: "child_seat",
    name: "Child Seat",
    price: 300,
    description: "Safety seat for children (0-4 years)",
  },
  {
    id: "gps",
    name: "GPS Navigation",
    price: 200,
    description: "Portable GPS device",
  },
  {
    id: "full_insurance",
    name: "Full Coverage Insurance",
    price: 800,
    description: "Zero excess / complete protection",
  },
  {
    id: "wifi",
    name: "Mobile Wi-Fi",
    price: 250,
    description: "Portable 4G hotspot",
  },
];

export const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", icon: "cellphone" },
  { id: "nagad", label: "Nagad", icon: "cellphone" },
  { id: "card", label: "Card", icon: "credit-card-outline" },
  { id: "cash", label: "Cash on Pickup", icon: "cash" },
];
