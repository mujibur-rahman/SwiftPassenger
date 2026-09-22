import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Multi-step form draft
  vehicle: {
    registrationNumber: "",
    brand: "",
    model: "",
    variant: "",
    year: "",
    fuelType: "Petrol",
    registrationCity: "",
  },
  personal: {
    fullName: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    pinCode: "",
    address: "",
    nomineeName: "",
    nomineeRelation: "",
  },
  coverage: {
    policyType: "Comprehensive", // Comprehensive | ThirdParty
    idv: 1250000,
    addOns: {
      zeroDepreciation: true,
      engineProtect: true,
      roadsideAssistance: false,
      consumables: false,
      ncbProtection: false,
      keyReplacement: false,
    },
  },
  quote: {
    basePremium: 0,
    addOnPremium: 0,
    gst: 0,
    totalPremium: 0,
  },
  billingCycle: "yearly", // "monthly" | "quarterly" | "yearly"
  // Issued policies (mock / from API)
  policies: [],
  activePolicyId: null,
};

const ADDON_PRICES = {
  zeroDepreciation: 1800,
  engineProtect: 950,
  roadsideAssistance: 450,
  consumables: 350,
  ncbProtection: 600,
  keyReplacement: 250,
};

function calculateQuote(coverage) {
  const base =
    coverage.policyType === "Comprehensive"
      ? Math.max(8000, Math.round(coverage.idv * 0.011))
      : 3200;

  let addOnPremium = 0;
  Object.entries(coverage.addOns || {}).forEach(([key, enabled]) => {
    if (enabled && ADDON_PRICES[key]) addOnPremium += ADDON_PRICES[key];
  });

  const subtotal = base + addOnPremium;
  const gst = Math.round(subtotal * 0.18);
  const totalPremium = subtotal + gst;

  return { basePremium: base, addOnPremium, gst, totalPremium };
}

const insuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    setVehicleDetails(state, action) {
      state.vehicle = { ...state.vehicle, ...action.payload };
    },
    setPersonalDetails(state, action) {
      state.personal = { ...state.personal, ...action.payload };
    },
    setCoverage(state, action) {
      state.coverage = { ...state.coverage, ...action.payload };
      state.quote = calculateQuote(state.coverage);
    },
    toggleAddOn(state, action) {
      const key = action.payload;
      if (state.coverage.addOns[key] !== undefined) {
        state.coverage.addOns[key] = !state.coverage.addOns[key];
        state.quote = calculateQuote(state.coverage);
      }
    },
    setPolicyType(state, action) {
      state.coverage.policyType = action.payload;
      state.quote = calculateQuote(state.coverage);
    },
    setIdv(state, action) {
      state.coverage.idv = action.payload;
      state.quote = calculateQuote(state.coverage);
    },
    recalculateQuote(state) {
      state.quote = calculateQuote(state.coverage);
    },
    setBillingCycle(state, action) {
      state.billingCycle = action.payload; // "monthly" | "quarterly" | "yearly"
    },
    resetInsuranceDraft(state) {
      state.vehicle = initialState.vehicle;
      state.personal = initialState.personal;
      state.coverage = initialState.coverage;
      state.quote = initialState.quote;
      state.billingCycle = initialState.billingCycle;
    },
    addPolicy(state, action) {
      state.policies.unshift(action.payload);
      state.activePolicyId = action.payload.id;
    },
    setPolicies(state, action) {
      state.policies = action.payload;
    },
  },
});

export const {
  setVehicleDetails,
  setPersonalDetails,
  setCoverage,
  toggleAddOn,
  setPolicyType,
  setIdv,
  recalculateQuote,
  setBillingCycle,
  resetInsuranceDraft,
  addPolicy,
  setPolicies,
} = insuranceSlice.actions;

export const selectInsuranceVehicle = (s) => s.insurance.vehicle;
export const selectInsurancePersonal = (s) => s.insurance.personal;
export const selectInsuranceCoverage = (s) => s.insurance.coverage;
export const selectInsuranceQuote = (s) => s.insurance.quote;
export const selectInsuranceBillingCycle = (s) => s.insurance.billingCycle;
export const selectInsurancePolicies = (s) => s.insurance.policies;

export default insuranceSlice.reducer;
