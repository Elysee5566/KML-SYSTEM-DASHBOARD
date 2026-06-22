// authApi.ts

import { api } from "../features/apiSlice"

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  id_card: string | null;
  role: string;
  is_2fa_enabled: boolean;
  must_change_password: boolean;
  is_profile_complete: boolean;
  missing_fields: string[];
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login/",
        method: "POST",
        body: data
      })
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-password/",
        method: "POST",
        body: data
      })
    }),
    getProfile:builder.query<UserProfile,void>({
      query:()=>"/users/me",
      providesTags:['Users']
    })
  })
})

export const {
  useLoginMutation,
  useGetProfileQuery,
  useChangePasswordMutation
} = authApi