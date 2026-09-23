// src/navigation/MainNavigator.js
import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

import HomeScreen from "@/screens/main/HomeScreen";
import RideBookingScreen from "@/screens/main/ride/RideBookingScreen";
import ActiveRideScreen from "@/screens/main/ride/ActiveRideScreen";
import RideCompletedScreen from "@/screens/main/ride/RideCompletedScreen";
import ActivityScreen from "@/screens/main/ride/ActivityScreen";
import ProfileScreen from "@/screens/main/profile/ProfileScreen";
import EditProfileScreen from "@/screens/main/profile/EditProfileScreen";
import PaymentMethodsScreen from "@/screens/main/PaymentMethodsScreen";
import NotificationsScreen from "@/screens/main/NotificationsScreen";
import SavedPlacesScreen from "@/screens/main/SavedPlacesScreen";
import HelpCenterScreen from "@/screens/main/HelpCenterScreen";

import FoodSearchScreen from "@/screens/main/food/FoodSearchScreen";
import FoodBrowseScreen from "@/screens/main/food/FoodBrowseScreen";
import FoodOrdersScreen from "@/screens/main/food/FoodOrdersScreen";
import FoodSearchResultsScreen from "@/screens/main/food/FoodSearchResultsScreen";
import RestaurantMenuScreen from "@/screens/main/food/RestaurantMenuScreen";
import CartScreen from "@/screens/main/food/CartScreen";
import FoodCheckoutScreen from "@/screens/main/food/FoodCheckoutScreen";
import ApplyOfferScreen from "@/screens/main/food/ApplyOfferScreen";
import DeliveryOptionScreen from "@/screens/main/food/DeliveryOptionScreen";
import FoodPaymentScreen from "@/screens/main/food/FoodPaymentScreen";
import ReviewOrderScreen from "@/screens/main/food/ReviewOrderScreen";
import OrderPlacedScreen from "@/screens/main/food/OrderPlacedScreen";
import TrackOrderScreen from "@/screens/main/food/TrackOrderScreen";
import RateFoodOrderScreen from "@/screens/main/food/RateFoodOrderScreen";
import ShopStoreSearchScreen from "@/screens/main/shop/ShopStoreSearchScreen";
import ShopListBuilderScreen from "@/screens/main/shop/ShopListBuilderScreen";
import ShopCheckoutScreen from "@/screens/main/shop/ShopCheckoutScreen";
import ShopPaymentScreen from "@/screens/main/shop/ShopPaymentScreen";
import ShopReviewOrderScreen from "@/screens/main/shop/ShopReviewOrderScreen";
import ShopOrderPlacedScreen from "@/screens/main/shop/ShopOrderPlacedScreen";
import ShopTrackOrderScreen from "@/screens/main/shop/ShopTrackOrderScreen";
import ShopPurchasedScreen from "@/screens/main/shop/ShopPurchasedScreen";
import ShopOnTheWayScreen from "@/screens/main/shop/ShopOnTheWayScreen";
import ShopDeliveredScreen from "@/screens/main/shop/ShopDeliveredScreen";
import ShopReceiptScreen from "@/screens/main/shop/ShopReceiptScreen";
import RateShopOrderScreen from "@/screens/main/shop/RateShopOrderScreen";
import ShopCompleteScreen from "@/screens/main/shop/ShopCompleteScreen";

import GigCategoriesScreen from "@/screens/main/gig/GigCategoriesScreen";
import GigQuestionScreen from "@/screens/main/gig/GigQuestionScreen";
import JobSummaryScreen from "@/screens/main/gig/JobSummaryScreen";
import ContactDetailsScreen from "@/screens/main/gig/ContactDetailsScreen";
import ReviewJobScreen from "@/screens/main/gig/ReviewJobScreen";
import JobPostedScreen from "@/screens/main/gig/JobPostedScreen";
import WaitingForQuotesScreen from "@/screens/main/gig/WaitingForQuotesScreen";
import QuotesReceivedScreen from "@/screens/main/gig/QuotesReceivedScreen";
import CompareQuotesScreen from "@/screens/main/gig/CompareQuotesScreen";
import ProviderProfileScreen from "@/screens/main/gig/ProviderProfileScreen";
import ConfirmBookingScreen from "@/screens/main/gig/ConfirmBookingScreen";
import BookingScheduledScreen from "@/screens/main/gig/BookingScheduledScreen";
import JobTrackingScreen from "@/screens/main/gig/JobTrackingScreen";
import JobCompletedScreen from "@/screens/main/gig/JobCompletedScreen";
import RateReviewScreen from "@/screens/main/gig/RateReviewScreen";

import MarketplacePickupScreen from "@/screens/main/marketplace/MarketplacePickupScreen";
import MarketplacePickupLocationScreen from "@/screens/main/marketplace/MarketplacePickupLocationScreen";
import MarketplaceSellerInfoScreen from "@/screens/main/marketplace/MarketplaceSellerInfoScreen";
import MarketplaceItemDetailsScreen from "@/screens/main/marketplace/MarketplaceItemDetailsScreen";
import MarketplaceDeliveryLocationScreen from "@/screens/main/marketplace/MarketplaceDeliveryLocationScreen";
import MarketplaceEstimateScreen from "@/screens/main/marketplace/MarketplaceEstimateScreen";
import MarketplaceConfirmScreen from "@/screens/main/marketplace/MarketplaceConfirmScreen";
import MarketplaceSearchingScreen from "@/screens/main/marketplace/MarketplaceSearchingScreen";
import MarketplaceTrackingScreen from "@/screens/main/marketplace/MarketplaceTrackingScreen";
import MarketplaceCompletedScreen from "@/screens/main/marketplace/MarketplaceCompletedScreen";
import MarketplaceRateScreen from "@/screens/main/marketplace/MarketplaceRateScreen";

import InsuranceTypesScreen from "@/screens/main/insurance/InsuranceTypesScreen";
import InsuranceTypeDetailsScreen from "@/screens/main/insurance/InsuranceTypeDetailsScreen";
import VehicleDetailsScreen from "@/screens/main/insurance/VehicleDetailsScreen";
import PersonalDetailsScreen from "@/screens/main/insurance/PersonalDetailsScreen";
import CoverageSelectionScreen from "@/screens/main/insurance/CoverageSelectionScreen";
import QuoteSummaryScreen from "@/screens/main/insurance/QuoteSummaryScreen";
import PolicyReviewScreen from "@/screens/main/insurance/PolicyReviewScreen";
import InsurancePaymentScreen from "@/screens/main/insurance/InsurancePaymentScreen";
import PolicySuccessScreen from "@/screens/main/insurance/PolicySuccessScreen";
import MyPoliciesScreen from "@/screens/main/insurance/MyPoliciesScreen";
import ClaimTypeScreen from "@/screens/main/insurance/ClaimTypeScreen";

// Car Rental
import CarRentalHomeScreen from "@/screens/main/rental/CarRentalHomeScreen";
import CarListScreen from "@/screens/main/rental/CarListScreen";
import CarDetailsScreen from "@/screens/main/rental/CarDetailsScreen";
import RentalBookingSummaryScreen from "@/screens/main/rental/RentalBookingSummaryScreen";
import RentalPaymentScreen from "@/screens/main/rental/RentalPaymentScreen";
import RentalConfirmationScreen from "@/screens/main/rental/RentalConfirmationScreen";
import MyRentalsScreen from "@/screens/main/rental/MyRentalsScreen";

import ParcelDeliveryHomeScreen from "@/screens/main/parcel/ParcelDeliveryHomeScreen";
import ParcelPickupLocationScreen from "@/screens/main/parcel/ParcelPickupLocationScreen";
import ParcelDeliveryLocationScreen from "@/screens/main/parcel/ParcelDeliveryLocationScreen";
import ParcelDetailsScreen from "@/screens/main/parcel/ParcelDetailsScreen";
import ParcelSizeWeightScreen from "@/screens/main/parcel/ParcelSizeWeightScreen";
import ParcelSenderInformationScreen from "@/screens/main/parcel/ParcelSenderInformationScreen";
import ParcelReceiverInformationScreen from "@/screens/main/parcel/ParcelReceiverInformationScreen";
import ParcelDeliveryOptionsScreen from "@/screens/main/parcel/ParcelDeliveryOptionsScreen";
import ParcelFareEstimateScreen from "@/screens/main/parcel/ParcelFareEstimateScreen";
import ParcelPaymentScreen from "@/screens/main/parcel/ParcelPaymentScreen";
import ParcelOrderReviewScreen from "@/screens/main/parcel/ParcelOrderReviewScreen";
import ParcelConfirmScreen from "@/screens/main/parcel/ParcelConfirmScreen";
import ParcelSearchingScreen from "@/screens/main/parcel/ParcelSearchingScreen";
import ParcelTrackingScreen from "@/screens/main/parcel/ParcelTrackingScreen";
import ParcelDeliveredScreen from "@/screens/main/parcel/ParcelDeliveredScreen";
import ParcelReceiptScreen from "@/screens/main/parcel/ParcelReceiptScreen";
import ParcelRateScreen from "@/screens/main/parcel/ParcelRateScreen";
import ParcelCompleteScreen from "@/screens/main/parcel/ParcelCompleteScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/** Tab metadata — edit labels/icons only */
const TAB_CONFIG = {
  Home: {
    label: "Home",
    icon: "home-outline",
    iconFocused: "home",
  },
  Activity: {
    label: "Activity",
    icon: "clock-outline",
    iconFocused: "clock",
  },
  Profile: {
    label: "Profile",
    icon: "account-outline",
    iconFocused: "account",
  },
};

/** Floating pill tab bar (theme-aware) */
function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const pillBg = colors?.primary ?? "#38BDF8";
  const activeIcon = isDark ? "#060E1A" : "#FFFFFF";
  const inactiveIcon = isDark
    ? "rgba(6,14,26,0.55)"
    : "rgba(255,255,255,0.7)";
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: bottomPad,
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: pillBg,
          borderRadius: 999,
          paddingVertical: 10,
          paddingHorizontal: 8,
          width: "100%",
          maxWidth: 400,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
            },
            android: { elevation: 12 },
          }),
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const cfg = TAB_CONFIG[route.name] || {
            label: route.name,
            icon: "circle-outline",
            iconFocused: "circle",
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 4,
              }}
            >
              <Icon
                name={focused ? cfg.iconFocused : cfg.icon}
                size={22}
                color={focused ? activeIcon : inactiveIcon}
              />
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 11,
                  fontWeight: focused ? "700" : "500",
                  color: focused ? activeIcon : inactiveIcon,
                }}
              >
                {cfg.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
        sceneContainerStyle: {
          backgroundColor: colors?.background ?? "#060E1A",
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { colors } = useTheme();
  const bg = colors?.background ?? "#060E1A";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: bg },
        contentStyle: { backgroundColor: bg },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen
        name="RideBooking"
        component={RideBookingScreen}
        options={{
          presentation: "transparentModal",
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />

      {/* Order Food flow — all stack screens under Main Navigator */}
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
      <Stack.Screen name="FoodBrowse" component={FoodBrowseScreen} />
      <Stack.Screen name="FoodOrders" component={FoodOrdersScreen} />
      <Stack.Screen name="FoodSearchResults" component={FoodSearchResultsScreen} />
      <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
      <Stack.Screen name="FoodCart" component={CartScreen} />
      <Stack.Screen name="FoodCheckout" component={FoodCheckoutScreen} />
      <Stack.Screen name="ApplyOffer" component={ApplyOfferScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="DeliveryOption" component={DeliveryOptionScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="FoodPayment" component={FoodPaymentScreen} />
      <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen name="RateFoodOrder" component={RateFoodOrderScreen} />
      {/*
        Shop for me — mirrors the food stack's shape (search → build →
        checkout → payment → review → placed → track → rate), plus one
        screen food has no equivalent of (ShopReceipt, for the itemized
        refund breakdown only shopping needs).
      */}
      <Stack.Screen name="ShopStoreSearch" component={ShopStoreSearchScreen} />
      <Stack.Screen name="ShopListBuilder" component={ShopListBuilderScreen} />
      <Stack.Screen name="ShopCheckout" component={ShopCheckoutScreen} />
      <Stack.Screen name="ShopPayment" component={ShopPaymentScreen} />
      <Stack.Screen name="ShopReviewOrder" component={ShopReviewOrderScreen} />
      <Stack.Screen name="ShopOrderPlaced" component={ShopOrderPlacedScreen} />
      <Stack.Screen name="ShopTrackOrder" component={ShopTrackOrderScreen} />
      <Stack.Screen name="ShopPurchased" component={ShopPurchasedScreen} />
      <Stack.Screen name="ShopOnTheWay" component={ShopOnTheWayScreen} />
      <Stack.Screen name="ShopDelivered" component={ShopDeliveredScreen} />
      <Stack.Screen name="ShopReceipt" component={ShopReceiptScreen} />
      <Stack.Screen name="RateShopOrder" component={RateShopOrderScreen} />
      <Stack.Screen name="ShopComplete" component={ShopCompleteScreen} />

      {/* Gig Jobs flow — all stack screens under Main Navigator */}
      <Stack.Screen name="GigCategories" component={GigCategoriesScreen} />
      <Stack.Screen name="GigQuestion" component={GigQuestionScreen} />
      <Stack.Screen name="JobSummary" component={JobSummaryScreen} />
      <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
      <Stack.Screen name="ReviewJob" component={ReviewJobScreen} />
      <Stack.Screen name="JobPosted" component={JobPostedScreen} />
      <Stack.Screen name="WaitingForQuotes" component={WaitingForQuotesScreen} />
      <Stack.Screen name="QuotesReceived" component={QuotesReceivedScreen} />
      <Stack.Screen name="CompareQuotes" component={CompareQuotesScreen} />
      <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
      <Stack.Screen
        name="ConfirmBooking"
        component={ConfirmBookingScreen}
        options={{
          presentation: "transparentModal",
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <Stack.Screen name="BookingScheduled" component={BookingScheduledScreen} />
      <Stack.Screen name="JobTracking" component={JobTrackingScreen} />
      <Stack.Screen name="JobCompleted" component={JobCompletedScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />

      {/* Marketplace flow */}
      <Stack.Screen name="MarketplacePickup" component={MarketplacePickupScreen} />
      <Stack.Screen name="MarketplacePickupLocation" component={MarketplacePickupLocationScreen} />
      <Stack.Screen name="MarketplaceSellerInfo" component={MarketplaceSellerInfoScreen} />
      <Stack.Screen name="MarketplaceItemDetails" component={MarketplaceItemDetailsScreen} />
      <Stack.Screen name="MarketplaceDeliveryLocation" component={MarketplaceDeliveryLocationScreen} />
      <Stack.Screen name="MarketplaceEstimate" component={MarketplaceEstimateScreen} />
      <Stack.Screen name="MarketplaceConfirm" component={MarketplaceConfirmScreen} />
      <Stack.Screen name="MarketplaceSearching" component={MarketplaceSearchingScreen} />
      <Stack.Screen name="MarketplaceTracking" component={MarketplaceTrackingScreen} />
      <Stack.Screen name="MarketplaceCompleted" component={MarketplaceCompletedScreen} />
      <Stack.Screen name="MarketplaceRate" component={MarketplaceRateScreen} />

      {/* Car Insurance flow */}
      <Stack.Screen name="InsuranceTypes" component={InsuranceTypesScreen} />
      <Stack.Screen name="InsuranceTypeDetails" component={InsuranceTypeDetailsScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="CoverageSelection" component={CoverageSelectionScreen} />
      <Stack.Screen name="QuoteSummary" component={QuoteSummaryScreen} />
      <Stack.Screen name="PolicyReview" component={PolicyReviewScreen} />
      <Stack.Screen name="InsurancePayment" component={InsurancePaymentScreen} />
      <Stack.Screen name="PolicySuccess" component={PolicySuccessScreen} />
      <Stack.Screen name="MyPolicies" component={MyPoliciesScreen} />
      <Stack.Screen name="ClaimType" component={ClaimTypeScreen} />

      {/*
        Parcel Delivery — its own domain (own slice, own API, own backend
        state machine), but tracking follows Marketplace's consolidation:
        driver_assigned through arrived_destination all live in ONE
        ParcelTrackingScreen rather than 6 near-duplicate screens.
      */}
      <Stack.Screen name="ParcelDeliveryHome" component={ParcelDeliveryHomeScreen} />
      <Stack.Screen name="ParcelPickupLocation" component={ParcelPickupLocationScreen} />
      <Stack.Screen name="ParcelDeliveryLocation" component={ParcelDeliveryLocationScreen} />
      <Stack.Screen name="ParcelDetails" component={ParcelDetailsScreen} />
      <Stack.Screen name="ParcelSizeWeight" component={ParcelSizeWeightScreen} />
      <Stack.Screen name="ParcelSenderInformation" component={ParcelSenderInformationScreen} />
      <Stack.Screen name="ParcelReceiverInformation" component={ParcelReceiverInformationScreen} />
      <Stack.Screen name="ParcelDeliveryOptions" component={ParcelDeliveryOptionsScreen} />
      <Stack.Screen name="ParcelFareEstimate" component={ParcelFareEstimateScreen} />
      <Stack.Screen name="ParcelPayment" component={ParcelPaymentScreen} />
      <Stack.Screen name="ParcelOrderReview" component={ParcelOrderReviewScreen} />
      <Stack.Screen name="ParcelConfirm" component={ParcelConfirmScreen} />
      <Stack.Screen name="ParcelSearching" component={ParcelSearchingScreen} />
      <Stack.Screen name="ParcelTracking" component={ParcelTrackingScreen} />
      <Stack.Screen name="ParcelDelivered" component={ParcelDeliveredScreen} />
      <Stack.Screen name="ParcelReceipt" component={ParcelReceiptScreen} />
      <Stack.Screen name="ParcelRate" component={ParcelRateScreen} />
      <Stack.Screen name="ParcelComplete" component={ParcelCompleteScreen} />

      {/* Car Rental flow */}
      <Stack.Screen name="CarRentalHome" component={CarRentalHomeScreen} />
      <Stack.Screen name="CarList" component={CarListScreen} />
      <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
      <Stack.Screen name="RentalBookingSummary" component={RentalBookingSummaryScreen} />
      <Stack.Screen name="RentalPayment" component={RentalPaymentScreen} />
      <Stack.Screen name="RentalConfirmation" component={RentalConfirmationScreen} />
      <Stack.Screen name="MyRentals" component={MyRentalsScreen} />
    </Stack.Navigator>
  );
}