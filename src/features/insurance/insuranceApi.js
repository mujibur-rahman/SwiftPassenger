import { apiSlice } from "@/features/api/apiSlice";

export const insuranceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch vehicle details by registration (mock auto-fetch)
    fetchVehicleByReg: builder.query({
      query: (regNumber) => `/insurance/vehicle/${encodeURIComponent(regNumber)}`,
      providesTags: ["InsuranceVehicle"],
    }),

    // Calculate / get quote
    getInsuranceQuote: builder.mutation({
      query: (body) => ({
        url: "/insurance/quote",
        method: "POST",
        body,
      }),
    }),

    // Purchase policy
    purchasePolicy: builder.mutation({
      query: (body) => ({
        url: "/insurance/policies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InsurancePolicy"],
    }),

    // List my policies
    getMyPolicies: builder.query({
      query: () => "/insurance/policies",
      providesTags: ["InsurancePolicy"],
    }),

    // Get single policy
    getPolicyById: builder.query({
      query: (id) => `/insurance/policies/${id}`,
      providesTags: (result, error, id) => [{ type: "InsurancePolicy", id }],
    }),

    // Submit claim
    submitClaim: builder.mutation({
      query: (body) => ({
        url: "/insurance/claims",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InsuranceClaim"],
    }),

    // List claims for a policy
    getClaims: builder.query({
      query: (policyId) => `/insurance/claims?policyId=${policyId}`,
      providesTags: ["InsuranceClaim"],
    }),
  }),
});

export const {
  useLazyFetchVehicleByRegQuery,
  useGetInsuranceQuoteMutation,
  usePurchasePolicyMutation,
  useGetMyPoliciesQuery,
  useGetPolicyByIdQuery,
  useSubmitClaimMutation,
  useGetClaimsQuery,
} = insuranceApi;
