import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";

/* ================= TYPES ================= */

export interface LoanInfo {
  id: number;
  reference?: string;
  remaining_balance?: string;
}

export interface LoanPayment {
  id: number;
  loan: LoanInfo; // 👈 changed (was just number)
  amount_paid: string;
  payment_proof?: string;
  status: "pending" | "approved" | "rejected";
  payment_date: string;
  reference?: string;

  reviewed_by?: {
    id: number;
    name: string;
  };
}

/* ================= API ================= */

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Payments", "Loans"],

  endpoints: (builder) => ({
    /* ================= CREATE ================= */

    createPayment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/loans/loan-payments/",
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // you can trigger toast here if you want globally
        } catch { }
      },

      invalidatesTags: ["Payments", "Loans"],
    }),

    /* ================= LIST ================= */

    getPayments: builder.query<
      any,
      {
        page?: number;
        page_size?: number;
        status?: string;
      } | void
    >({
      query: (params) => ({
        url: "/loans/loan-payments/",
        params,
      }),

      providesTags: (result) =>
        result?.results
          ? [
            ...result.results.map((p: any) => ({
              type: "Payments" as const,
              id: p.id,
            })),
            { type: "Payments", id: "LIST" },
          ]
          : [{ type: "Payments", id: "LIST" }],
    }),

    /* ================= SINGLE ================= */

    getPaymentById: builder.query<LoanPayment, number>({
      query: (id) => `/loans/loan-payments/${id}/`,
      providesTags: (_, __, id) => [{ type: "Payments", id }],
    }),
    /* ================= EDIT PAYMENT ================= */
    updatePayment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/loans/loan-payments/${id}/update_payment/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ['Payments']
    }),
    /* ================= REVIEW ================= */

    reviewPayment: builder.mutation<
      any,
      { id: number; action: "approve" | "reject" }
    >({
      query: ({ id, action }) => ({
        url: `/loans/loan-payments/${id}/review/`,
        method: "POST",
        body: { action },
      }),

      // 🔥 OPTIMISTIC UPDATE (SUPER IMPORTANT UX)
      async onQueryStarted(
        { id, action },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          paymentsApi.util.updateQueryData(
            "getPayments",
            undefined,
            (draft) => {
              const payment = draft.find((p: any) => p.id === id);
              if (payment) {
                payment.status =
                  action === "approve" ? "approved" : "rejected";
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // rollback if failed
        }
      },

      //   invalidatesTags: (result, error, { id }) => [
      //     { type: "Payments", id },
      //     { type: "Payments", id: "LIST" },
      //     { type: "Loans", id: "LIST" },
      //   ],
    }),

    /* ================= DELETE (OPTIONAL) ================= */

    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/loans/loan-payments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),
    // CANCEL PAYMENT AND REVERT LOAN BALANCE
    cancelPayment: builder.mutation({
      query: ({ id }) => ({
        url: `loans/loan-payments/${id}/cancel/`,
        method: "POST",
      }),
      invalidatesTags: ["Payments", "Loans"],
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */

export const {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useReviewPaymentMutation,
  useCancelPaymentMutation,
  useDeletePaymentMutation,
} = paymentsApi;