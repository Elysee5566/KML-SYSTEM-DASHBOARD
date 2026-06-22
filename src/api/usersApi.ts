import { api } from "../features/apiSlice";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      any,
      {
        page?: number;
        page_size?: number;
        search?: string;
        role?: string;
        two_fa?: string;
      }
    >({
      query: ({
        page = 1,
        page_size,
        search = "",
        role = "all",
        two_fa = "",
      }) => ({
        url: "/users/users/",
        params: {
          page,
          page_size,
          search,
          role,
          two_fa,
        },
      }),

      providesTags: ["Users"],
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/users/users/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],  // 🔥 triggers refetch
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/users/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],  // 🔥 triggers refetch
    }),
    // 🔹 GET ALL PASSWORD RESET REQUESTS
    getResetRequests: builder.query<any, void>({
      query: () => "/users/admin/password-reset/",
      providesTags: ["ResetRequests"],
    }),

    // 🔹 APPROVE PASSWORD RESET REQUEST
    approveResetRequest: builder.mutation({
      query: (id) => ({
        url: `/users/admin/password-reset/${id}/approve/`,
        method: "PATCH",
      }),
      invalidatesTags: ["ResetRequests"],
    }),
    // 🔹 REJECT PASSWORD RESET REQUEST
    rejectResetRequest: builder.mutation({
      query: (id) => ({
        url: `/users/admin/password-reset/${id}/reject/`,
        method: "PATCH",
      }),
      invalidatesTags: ["ResetRequests"],
    }),
  }),
});
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetResetRequestsQuery,
  useApproveResetRequestMutation,
  useRejectResetRequestMutation,
} = userApi;