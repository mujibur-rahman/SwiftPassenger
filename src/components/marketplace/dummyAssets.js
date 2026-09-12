/**
 * Marketplace dummy/local assets.
 * All local require() assets must be passed directly as `source={DUMMY.xxx}`.
 * Only plain string URL values should be wrapped in `source={{ uri: DUMMY.xxx }}`.
 */
export const DUMMY = {
  // Marketplace logos / popular stores (remote URLs — use { uri: ... })
  daraz: "https://picsum.photos/seed/daraz/96/96",
  facebook: "https://picsum.photos/seed/fbmarket/96/96",
  ebay: "https://picsum.photos/seed/ebay/96/96",
  localShop: "https://picsum.photos/seed/localshop/96/96",

  // Seller / shop (local asset — pass directly as source={DUMMY.sellerShop})
  sellerShop: require("@assets/images/marketplace/seller-shop.jpg"),

  // Item product (local asset — pass directly as source={DUMMY.itemProduct})
  itemProduct: require("@assets/images/marketplace/wireless-headphone.jpg"),

  // Driver avatar (local asset — pass directly as source={DUMMY.driverAvatar})
  driverAvatar: require("@assets/images/marketplace/driver-avatar.png"),

  // Hero banner (local asset)
  heroMarketplace: require("@assets/images/marketplace/marketplace-pickup.jpg"),

  // Illustrations (local assets — pass directly as source={DUMMY.xxx})
  searchingCar: require("@assets/images/marketplace/finding-driver.jpg"),
  arrivedStore: require("@assets/images/marketplace/driver-arrived.jpg"),
  mapRoute: require("@assets/images/marketplace/live.jpg"),
  deliveryHand: require("@assets/images/marketplace/delivery.png"),
  success: require("@assets/images/marketplace/order-successwebp.webp"),
};
