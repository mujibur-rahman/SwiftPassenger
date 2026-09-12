const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(express.json());

// Socket connection log
io.on("connection", (socket) => {
  console.log("[Socket] Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("[Socket] Client disconnected:", socket.id);
  });
});

const DEFAULT_LOCATION = {
  latitude: -32.7615,
  longitude: 151.7441,
  address: "Ralph Terrace, Australia",
};


const JWT_SECRET = "development-secret-change-this";
const REFRESH_SECRET = "refresh-secret-change-this";

const otpStore = {};
let users = [
  {
    id: 1,
    name: "Test User",
    phone: "1234",
    email: "1234",
    password: "1234",
  },
];
let refreshTokens = [];

// Normalize phone so "9840", " 9840 ", "+19840" match
const normalizePhone = (phone = "") =>
  String(phone).replace(/\D/g, ""); // keep digits only

const generateTokens = (user) => {
  const payload = { sub: user.id, phone: user.phone };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  refreshTokens.push(refreshToken);

  return { accessToken, refreshToken };
};

// ========== REGISTER ==========
app.post("/register", (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({
      message: "Name, phone and password are required",
    });
  }

  // Check if phone already exists
  const exists = users.find((u) => u.phone === phone);
  if (exists) {
    return res.status(400).json({
      message: "Phone number already registered",
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    phone,
    email: email || phone,
    password,
  };

  users.push(newUser);

  const token = jwt.sign(
    { sub: newUser.id, phone: newUser.phone },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Never send password back
  const { password: _, ...safeUser } = newUser;

  return res.status(201).json({
    accessToken: token,
    token: token, // support both names
    user: safeUser,
  });
});

// ========== LOGIN ==========
app.post("/login", (req, res) => {
  const { phone, password, email } = req.body;
  const loginPhone = phone || email; // support both

  const user = users.find(
    (u) => u.phone === loginPhone && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid phone or password",
    });
  }

  const token = jwt.sign(
    { sub: user.id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return res.json({
    accessToken: token,
    token: token,
    user: safeUser,
  });
});

// ========== SEND OTP ==========
app.post("/auth/otp/send", (req, res) => {
  const phone = normalizePhone(req.body.phone);

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const otp = "123456"; // fixed for development

  otpStore[phone] = {
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  console.log(`OTP for [${phone}]: ${otp}`);
  console.log("Current otpStore →", otpStore);

  return res.json({
    message: "OTP sent successfully",
    debugOtp: otp,
  });
});

// ========== VERIFY OTP ==========
app.post("/auth/otp/verify", (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp || "").trim();

  console.log("Verify attempt →", { phone, otp, store: otpStore });

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const record = otpStore[phone];

  if (!record) {
    return res.status(400).json({
      message: "OTP not found. Please request again.",
    });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[phone];
    return res.status(400).json({ message: "OTP expired. Please request again." });
  }

  if (String(record.code) !== String(otp)) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  delete otpStore[phone];

  let user = users.find((u) => u.phone === phone);
  if (!user) {
    user = {
      id: users.length + 1,
      name: `User ${phone}`,
      phone,
      email: phone,
      password: "",
    };
    users.push(user);
  }

  const tokens = generateTokens(user);
  const { password: _, ...safeUser } = user;

  return res.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    token: tokens.accessToken,
    user: safeUser,
  });
});

// Optional: list users (for testing)
app.get("/users", (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// ========== RIDE MOCK ==========
let rides = [];
let rideIdCounter = 1;

const FAKE_DRIVERS = [
  {
    id: 101,
    name: "Karim Hassan",
    phone: "01710000001",
    rating: 4.9,
    vehicle: { model: "Toyota Corolla", color: "White", plate: "DHAKA-METRO-GA-12-3456" },
    photo: null,
  },
  {
    id: 102,
    name: "Rahim Uddin",
    phone: "01710000002",
    rating: 4.7,
    vehicle: { model: "Honda Civic", color: "Black", plate: "DHAKA-METRO-GA-65-4321" },
    photo: null,
  },
  {
    id: 103,
    name: "Salma Akter",
    phone: "01710000003",
    rating: 4.8,
    vehicle: { model: "Hyundai Accent", color: "Silver", plate: "DHAKA-METRO-CHA-11-2222" },
    photo: null,
  },
];

function distanceKm(a, b) {
  if (!a?.latitude || !b?.latitude) return 5;
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function pickFakeDriver() {
  return FAKE_DRIVERS[Math.floor(Math.random() * FAKE_DRIVERS.length)];
}

/** After delay, move ride searching → accepted and attach driver */
function assignDriverLater(rideId, delayMs = 3000) {
  setTimeout(() => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride || ride.status !== "searching") return;

    const driver = pickFakeDriver();
    const pickup = ride.pickup;

    ride.status = "accepted";
    ride.driver = {
      ...driver,
      location: {
        latitude: (pickup?.latitude || DEFAULT_LOCATION.latitude) + 0.004,
        longitude: (pickup?.longitude || DEFAULT_LOCATION.longitude) + 0.003,
      },
    };
    console.log(`Driver assigned to ride #${rideId} →`, driver.name);

    // pickup after 8s total
    setTimeout(() => {
      if (ride.status === "accepted") {
        ride.status = "pickup";
        console.log(`Ride #${rideId} → pickup (arrived)`);
      }
    }, 5000);

    // ongoing after 13s
    setTimeout(() => {
      if (ride.status === "pickup") {
        ride.status = "ongoing";
        console.log(`Ride #${rideId} → ongoing`);
      }
    }, 10000);

    // completed after 20s
    setTimeout(() => {
      if (ride.status === "ongoing") {
        ride.status = "completed";
        console.log(`Ride #${rideId} → completed`);
      }
    }, 17000);
  }, delayMs);
}

// ========== FARE ESTIMATE ==========
app.post("/rides/estimate", (req, res) => {
  const { origin, destination } = req.body || {};

  if (!origin || !destination) {
    return res.status(400).json({ message: "origin and destination are required" });
  }

  const km = distanceKm(origin, destination);
  const durationMin = Math.max(5, Math.round(km * 3.5));
  const baseFare = 50;
  const perKm = 25;
  const fare = Math.round(baseFare + km * perKm);

  return res.json({
    fare,
    price: fare,
    currency: "BDT",
    distanceKm: Number(km.toFixed(2)),
    durationMinutes: durationMin,
    duration: durationMin * 60,
    breakdown: { base: baseFare, distance: Math.round(km * perKm) },
  });
});

// ========== REQUEST RIDE (+ schedule fake driver) ==========
app.post("/rides/request", (req, res) => {
  const { pickup, destination, rideType, estimatedFare } = req.body || {};

  if (!pickup || !destination) {
    return res.status(400).json({ message: "pickup and destination required" });
  }

  const ride = {
    id: rideIdCounter++,
    pickup,
    destination,
    rideType: rideType || "standard",
    estimatedFare: estimatedFare || 150,
    status: "searching", // first response: still searching
    driver: null,
    createdAt: new Date().toISOString(),
  };

  rides.push(ride);

  // Assign fake driver after 3 seconds
  assignDriverLater(ride.id, 3000);

  console.log("Ride requested →", ride.id, "(driver in ~3s)");

  return res.status(201).json(ride);
});

// ========== ACTIVE RIDE ==========
app.get("/rides/active", (req, res) => {
  const active = [...rides]
    .reverse()
    .find((r) =>
      ["searching", "accepted", "pickup", "ongoing"].includes(r.status)
    );

  if (!active) {
    return res.json({ ride: null, driver: null });
  }

  return res.json({
    ride: active,
    driver: active.driver || null,
  });
});

// ========== HISTORY ==========
app.get("/rides/history", (req, res) => {
  return res.json(
    rides.filter((r) => ["completed", "cancelled"].includes(r.status))
  );
});

// ========== CANCEL ==========
app.post("/rides/:id/cancel", (req, res) => {
  const id = Number(req.params.id);
  const ride = rides.find((r) => r.id === id);
  if (!ride) return res.status(404).json({ message: "Ride not found" });
  ride.status = "cancelled";
  ride.driver = null;
  return res.json(ride);
});

// ========== RATING ==========
app.post("/rides/:id/rating", (req, res) => {
  const id = Number(req.params.id);
  const { rating, review } = req.body || {};
  const ride = rides.find((r) => r.id === id);
  if (!ride) return res.status(404).json({ message: "Ride not found" });
  ride.rating = rating;
  ride.review = review || "";
  ride.status = "completed";
  return res.json(ride);
});

// Optional: force status (for testing)
app.patch("/rides/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  const ride = rides.find((r) => r.id === id);
  if (!ride) return res.status(404).json({ message: "Ride not found" });
  ride.status = status;
  return res.json(ride);
});

// ========== FOOD MOCK DATA ==========
const RESTAURANTS = [
  {
    id: 201,
    name: "Burger King",
    category: "Burgers · Fast Food",
    rating: 4.5,
    ratingCount: 2300,
    etaMinutes: "20-30 min",
    deliveryFee: 2.0,
    menu: [
      { id: 1, name: "Chicken Burger", description: "Crispy chicken, lettuce, tomato, spicy mayo, sesame bun", price: 5.99, category: "Burgers" },
      { id: 2, name: "Beef Burger", description: "Juicy beef, cheese, lettuce, tomato", price: 6.99, category: "Burgers" },
      { id: 3, name: "Fries", description: "Golden crispy fries, salted", price: 2.49, category: "Sides" },
      { id: 4, name: "Coke", description: "Chilled, 400ml", price: 1.49, category: "Drinks" },
    ],
  },
  {
    id: 202,
    name: "The Burger House",
    category: "Burgers · American",
    rating: 4.6,
    ratingCount: 1800,
    etaMinutes: "25-35 min",
    deliveryFee: 2.5,
    menu: [
      { id: 5, name: "Classic Cheeseburger", description: "Beef patty, cheddar, pickles, house sauce", price: 7.49, category: "Burgers" },
      { id: 6, name: "Onion Rings", description: "Crispy battered onion rings", price: 3.49, category: "Sides" },
    ],
  },
  {
    id: 203,
    name: "McDonald's",
    category: "Burgers · Fast Food",
    rating: 4.3,
    ratingCount: 4200,
    etaMinutes: "25-40 min",
    deliveryFee: 1.99,
    menu: [
      { id: 7, name: "Big Mac", description: "Two beef patties, special sauce, lettuce, cheese", price: 5.49, category: "Burgers" },
      { id: 8, name: "McNuggets (6pc)", description: "Crispy chicken nuggets with dip", price: 4.29, category: "Sides" },
    ],
  },
  {
    id: 204,
    name: "Burger Lab",
    category: "Burgers · Gourmet",
    rating: 4.7,
    ratingCount: 950,
    etaMinutes: "30-45 min",
    deliveryFee: 3.0,
    menu: [
      { id: 9, name: "Truffle Burger", description: "Wagyu beef, truffle aioli, arugula", price: 11.99, category: "Burgers" },
    ],
  },
];

const OFFERS = [
  { code: "EATS10", title: "10% OFF", subtitle: "Up to $5 · Min. spend $15", type: "percent", value: 10, maxDiscount: 5, minSpend: 15 },
  { code: "FOOD3", title: "$3 OFF", subtitle: "Min. spend $12", type: "flat", value: 3, minSpend: 12 },
  { code: "DELIVERY", title: "Free Delivery", subtitle: "Min. spend $10", type: "free_delivery", value: 0, minSpend: 10 },
  { code: "EATS15", title: "15% OFF", subtitle: "Min. spend $20", type: "percent", value: 15, maxDiscount: 8, minSpend: 20 },
];

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", etaMinutes: "20-30 min", fee: 2.0 },
  { id: "priority", label: "Priority Delivery", etaMinutes: "15-20 min", fee: 4.99 },
];

const FAKE_RIDERS = [
  { id: 301, name: "Rahim Ahmed", phone: "01710000011", rating: 4.8, ratingCount: 1200, vehicle: "Bike" },
  { id: 302, name: "Karim Hossain", phone: "01710000012", rating: 4.6, ratingCount: 800, vehicle: "Bike" },
];

function pickFakeRider() {
  return FAKE_RIDERS[Math.floor(Math.random() * FAKE_RIDERS.length)];
}

// ========== SEARCH RESTAURANTS ==========
app.get("/food/restaurants", (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();

  const results = !q
    ? RESTAURANTS
    : RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.menu.some((m) => m.name.toLowerCase().includes(q))
    );

  // strip menu for list view
  return res.json(results.map(({ menu, ...r }) => r));
});

// ========== RESTAURANT + MENU ==========
app.get("/food/restaurants/:id", (req, res) => {
  const restaurant = RESTAURANTS.find((r) => r.id === Number(req.params.id));
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  return res.json(restaurant);
});

// ========== OFFERS ==========
app.get("/food/offers", (req, res) => {
  return res.json(OFFERS);
});

// ========== DELIVERY OPTIONS ==========
app.get("/food/delivery-options", (req, res) => {
  return res.json(DELIVERY_OPTIONS);
});

// ========== ORDERS ==========
let foodOrders = [];
let foodOrderIdCounter = 1;

/** searching→preparing→on_the_way→delivered, same style as assignDriverLater */
function progressOrder(orderId) {
  setTimeout(() => {
    const order = foodOrders.find((o) => o.id === orderId);
    if (!order || order.status !== "confirmed") return;
    order.status = "preparing";
  }, 2000);

  setTimeout(() => {
    const order = foodOrders.find((o) => o.id === orderId);
    if (!order || order.status !== "preparing") return;
    order.status = "on_the_way";
    order.rider = {
      ...pickFakeRider(),
      location: { latitude: 23.8103, longitude: 90.4125 },
      etaMinutes: 12,
    };
  }, 8000);

  setTimeout(() => {
    const order = foodOrders.find((o) => o.id === orderId);
    if (!order || order.status !== "on_the_way") return;
    order.status = "delivered";
  }, 20000);
}

app.post("/food/orders", (req, res) => {
  const {
    restaurantId,
    restaurantName,
    items,
    offerCode,
    deliveryOptionId,
    deliveryAddress,
    paymentMethod,
    subtotal,
    deliveryFee,
    serviceFee,
    discount,
    total,
  } = req.body || {};

  if (!restaurantId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "restaurantId and items are required" });
  }

  const order = {
    id: foodOrderIdCounter++,
    restaurantId,
    restaurantName,
    items,
    offerCode: offerCode || null,
    deliveryOptionId: deliveryOptionId || "standard",
    deliveryAddress,
    paymentMethod,
    subtotal: subtotal || 0,
    deliveryFee: deliveryFee || 0,
    serviceFee: serviceFee || 0,
    discount: discount || 0,
    total: total || 0,
    status: "confirmed", // confirmed → preparing → on_the_way → delivered
    rider: null,
    createdAt: new Date().toISOString(),
  };

  foodOrders.push(order);
  progressOrder(order.id);

  console.log("Food order placed →", order.id, order.restaurantName);

  return res.status(201).json(order);
});

app.get("/food/orders/active", (req, res) => {
  const active = [...foodOrders]
    .reverse()
    .find((o) => ["confirmed", "preparing", "on_the_way"].includes(o.status));

  if (!active) return res.json({ order: null });
  return res.json({ order: active });
});

app.get("/food/orders/history", (req, res) => {
  return res.json(foodOrders.filter((o) => o.status === "delivered"));
});

app.get("/food/orders/:id", (req, res) => {
  const order = foodOrders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json(order);
});

// ========== GIG JOBS MOCK ==========
// Same pattern as the RIDE and FOOD mocks above: in-memory arrays +
// setTimeout progression (assignDriverLater / progressOrder), just for the
// Gig Jobs → Lawn Mowing customer flow. Matches the endpoints already
// scaffolded in src/features/gig/gigApi.js (postGigJob, getQuotes,
// confirmGigBooking, submitGigReview) exactly, so wiring the client to call
// these hooks instead of the local mock reducers is a drop-in swap.
let gigJobs = [];
let gigJobIdCounter = 1;
let gigBookings = [];
let gigBookingIdCounter = 1;
let gigReviews = [];
let gigReviewIdCounter = 1;

const FAKE_GIG_PROVIDERS = [
  {
    id: "q1",
    providerName: "John's Gardening",
    rating: 4.9,
    reviews: 127,
    price: 55,
    availability: "Available today · 2:00 PM",
    distance: "0.9 km away",
    message: "Happy to help, I mow this street every week!",
    services: ["Lawn mowing", "Edging", "Garden clean-up"],
  },
  {
    id: "q2",
    providerName: "Mike's Lawn Care",
    rating: 4.8,
    reviews: 86,
    price: 45,
    availability: "Available today · 4:30 PM",
    distance: "3.2 km away",
    message: "Can do a same-week booking, fully insured.",
    services: ["Lawn mowing", "Hedge trimming"],
  },
  {
    id: "q3",
    providerName: "GreenLeaf Services",
    rating: 5.0,
    reviews: 34,
    price: 60,
    availability: "Available tomorrow · 9:00 AM",
    distance: "4.8 km away",
    message: "Quick turnaround, clippings taken away included.",
    services: ["Lawn mowing", "Clippings removal", "Weeding"],
  },
];

/** After delay, attach quotes to the job — same shape as assignDriverLater */
function attachGigQuotesLater(jobId, delayMs = 5000) {
  setTimeout(() => {
    const job = gigJobs.find((j) => j.id === jobId);
    if (!job || job.status !== "posted") return;

    job.status = "quotes_ready";
    job.quotes = FAKE_GIG_PROVIDERS.map((p) => ({ ...p }));
    console.log(`Quotes ready for gig job #${jobId}`);

    // Real-time emit
    io.emit("gig:quotes_ready", {
      jobId: job.id,
      quotes: job.quotes,
    });
  }, delayMs);
}

/** Simulate the provider progressing through the job, same shape as progressOrder */
function progressGigBooking(bookingId) {
  const STEPS = ["confirmed", "on_the_way", "arrived", "started", "completed"];

  STEPS.slice(1).forEach((status, i) => {
    setTimeout(
      () => {
        const booking = gigBookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const prevStatus = STEPS[STEPS.indexOf(status) - 1];
        if (booking.status !== prevStatus) return;

        booking.status = status;
        console.log(`Gig booking #${bookingId} → ${status}`);

        // Real-time emit
        io.emit("gig:booking_status", {
          bookingId: booking.id,
          status: booking.status,
          booking: booking,
        });
      },
      (i + 1) * 6000,
    );
  });
}

// ========== POST GIG JOB (+ schedule fake quotes) ==========
app.post("/gig/jobs", (req, res) => {
  const { serviceId, answers, contact } = req.body || {};

  if (!serviceId || !answers) {
    return res.status(400).json({ message: "serviceId and answers are required" });
  }

  const job = {
    id: gigJobIdCounter++,
    serviceId,
    answers,
    contact: contact || null,
    status: "posted", // posted → quotes_ready
    quotes: [],
    createdAt: new Date().toISOString(),
  };

  gigJobs.push(job);
  attachGigQuotesLater(job.id, 5000);

  console.log("Gig job posted →", job.id, serviceId, "(quotes in ~5s)");

  return res.status(201).json(job);
});

// ========== GET GIG JOB (status + quotes) ==========
app.get("/gig/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const job = gigJobs.find((j) => j.id === id);
  if (!job) return res.status(404).json({ message: "Gig job not found" });
  return res.json(job);
});

// ========== GET QUOTES FOR A JOB ==========
app.get("/gig/jobs/:id/quotes", (req, res) => {
  const id = Number(req.params.id);
  const job = gigJobs.find((j) => j.id === id);
  if (!job) return res.status(404).json({ message: "Gig job not found" });
  return res.json(job.quotes);
});

// ========== CONFIRM BOOKING (+ schedule fake status progression) ==========
app.post("/gig/bookings", (req, res) => {
  const { jobId, quoteId, provider, price, location } = req.body || {};

  if (!quoteId) {
    return res.status(400).json({ message: "quoteId is required" });
  }

  const booking = {
    id: gigBookingIdCounter++,
    jobId: jobId || null,
    quoteId,
    provider: provider || null,
    price: price || 0,
    location: location || null,
    scheduledAt: new Date().toISOString(),
    status: "confirmed", // confirmed → on_the_way → arrived → started → completed
  };

  gigBookings.push(booking);
  progressGigBooking(booking.id);

  console.log("Gig booking confirmed →", booking.id, booking.provider);

  return res.status(201).json(booking);
});

// ========== GET BOOKING (status) ==========
app.get("/gig/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const booking = gigBookings.find((b) => b.id === id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  return res.json(booking);
});

// ========== SUBMIT REVIEW ==========
app.post("/gig/reviews", (req, res) => {
  const { quoteId, bookingId, rating, text, tags } = req.body || {};

  if (!rating) {
    return res.status(400).json({ message: "rating is required" });
  }

  const review = {
    id: gigReviewIdCounter++,
    quoteId: quoteId || null,
    bookingId: bookingId || null,
    rating,
    text: text || "",
    tags: tags || [],
    createdAt: new Date().toISOString(),
  };

  gigReviews.push(review);

  console.log("Gig review submitted →", review.id, "rating:", review.rating);

  return res.status(201).json(review);
});

// ========== MARKETPLACE PICKUP MOCK ==========
let marketplacePickups = [];
let marketplacePickupIdCounter = 1;

const FAKE_MARKETPLACE_DRIVERS = [
  { id: "d1", name: "Alex Rivera", vehicle: "Toyota Corolla · ABC-123" },
  { id: "d2", name: "Sam Chen", vehicle: "Honda Civic · XYZ-789" },
];

function progressMarketplacePickup(pickupId) {
  const STEPS = [
    "searching",
    "driver_assigned",
    "driver_to_seller",
    "arrived_seller",
    "item_picked",
    "on_the_way",
    "arrived_customer",
    "delivered",
    "completed",
  ];

  // Delays from create time (ms)
  const DELAYS = [3000, 8000, 13000, 18000, 23000, 28000, 33000, 38000];

  STEPS.slice(1).forEach((status, i) => {
    setTimeout(() => {
      const pickup = marketplacePickups.find((p) => p.id === pickupId);
      if (!pickup) return;
      if (["cancelled", "completed"].includes(pickup.status)) return;

      // Always advance to this step if we haven't reached it yet
      const currentIdx = STEPS.indexOf(pickup.status);
      const nextIdx = STEPS.indexOf(status);
      if (nextIdx <= currentIdx) return;

      pickup.status = status;
      if (status === "driver_assigned" && !pickup.driver) {
        pickup.driver =
          FAKE_MARKETPLACE_DRIVERS[Math.floor(Math.random() * FAKE_MARKETPLACE_DRIVERS.length)];
      }

      console.log(`Marketplace pickup #${pickupId} → ${status}`);

      if (typeof io !== "undefined") {
        io.emit("marketplace:pickup:status", {
          pickupId: pickup.id,
          status: pickup.status,
          pickup,
        });
        if (status === "driver_assigned") {
          io.emit("marketplace:pickup:driver_assigned", {
            pickupId: pickup.id,
            status: "driver_assigned",
            driver: pickup.driver,
            pickup,
          });
        }
      }
    }, DELAYS[i] || (i + 1) * 5000);
  });
}

// GET options
app.get("/marketplace/pickup/options", (req, res) => {
  return res.json([
    { id: "opt1", title: "Local marketplace / bazaar", subtitle: "Collect from a stall or shop" },
    { id: "opt2", title: "Online seller meetup", subtitle: "Facebook / Marketplace seller" },
  ]);
});

// POST estimate
app.post("/marketplace/pickup/estimate", (req, res) => {
  const { sellerAddress, deliveryAddress } = req.body || {};
  // Simple mock fare
  const distanceKm = 4.2;
  const fare = Math.max(8, Math.round(distanceKm * 2.5 * 10) / 10);
  return res.json({
    fare,
    distanceKm,
    durationMin: Math.round(distanceKm * 3.5),
    currency: "$",
  });
});

// POST request
app.post("/marketplace/pickup/request", (req, res) => {
  const body = req.body || {};
  if (!body.sellerName || !body.itemDescription) {
    return res.status(400).json({ message: "sellerName and itemDescription are required" });
  }

  const pickup = {
    id: marketplacePickupIdCounter++,
    ...body,
    status: "searching",
    driver: null,
    createdAt: new Date().toISOString(),
  };

  marketplacePickups.push(pickup);
  progressMarketplacePickup(pickup.id);

  console.log("Marketplace pickup created →", pickup.id);
  return res.status(201).json(pickup);
});

// GET active
app.get("/marketplace/pickup/active", (req, res) => {
  const active = marketplacePickups.find(
    (p) => !["completed", "cancelled", "delivered"].includes(p.status)
  );
  return res.json(active || null);
});

// GET by id
app.get("/marketplace/pickup/:id", (req, res) => {
  const id = Number(req.params.id);
  const pickup = marketplacePickups.find((p) => p.id === id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  return res.json(pickup);
});

// POST cancel
app.post("/marketplace/pickup/:id/cancel", (req, res) => {
  const id = Number(req.params.id);
  const pickup = marketplacePickups.find((p) => p.id === id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  pickup.status = "cancelled";
  return res.json(pickup);
});

// POST verify (optional)
app.post("/marketplace/pickup/:id/verify", (req, res) => {
  const id = Number(req.params.id);
  const pickup = marketplacePickups.find((p) => p.id === id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  pickup.verified = true;
  return res.json(pickup);
});

// POST rating
app.post("/marketplace/pickup/:id/rating", (req, res) => {
  const id = Number(req.params.id);
  const { rating } = req.body || {};
  const pickup = marketplacePickups.find((p) => p.id === id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (!rating) return res.status(400).json({ message: "rating is required" });
  pickup.rating = rating;
  return res.status(201).json({ id, rating, pickupId: id });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("✅ Auth server + Socket.IO running on http://0.0.0.0:3000");
});