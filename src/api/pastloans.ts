import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";

export const pastLoanSheetApi = createApi({
  reducerPath: "pastLoanSheetApi",

  baseQuery: baseQueryWithAuth,

  tagTypes: ["PastLoanSheets"],

  endpoints: (builder) => ({
    getPastLoanSheets: builder.query({
      query: () => "/loans/past-loan-sheets/",

      providesTags: ["PastLoanSheets"],
    }),

    uploadPastLoanSheet: builder.mutation({
      query: (formData) => ({
        url: "/loans/past-loan-sheets/",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["PastLoanSheets"],
    }),

    getPastLoanSheetData: builder.query({
      query: (id) =>
        `/loans/past-loan-sheets/${id}/data/`,
    }),

    deletePastLoanSheet: builder.mutation({
      query: (id) => ({
        url: `/loans/past-loan-sheets/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["PastLoanSheets"],
    }),

    setActivePastLoanSheet: builder.mutation({
      query: (id) => ({
        url: `/loans/past-loan-sheets/${id}/set-active/`,
        method: "PATCH",
      }),

      invalidatesTags: ["PastLoanSheets"],
    }),
  }),
});

export const {
  useGetPastLoanSheetsQuery,
  useUploadPastLoanSheetMutation,
  useGetPastLoanSheetDataQuery,
  useDeletePastLoanSheetMutation,
  useSetActivePastLoanSheetMutation,
} = pastLoanSheetApi;