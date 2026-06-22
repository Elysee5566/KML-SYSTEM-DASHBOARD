import { api } from "../features/apiSlice";

export const onboardingApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // =========================
        // 📌 GET ALL VIDEOS (OPTIONAL FILTER)
        // =========================
        getOnboardingVideos: builder.query({
            query: (category) => {
                if (category) {
                    return `/onboarding/?category=${category}`;
                }
                return "/onboarding/";
            },
            providesTags: ["Onboarding"],
        }),

        // =========================
        // 🎯 GET ACTIVE VIDEO (GLOBAL OR BY CATEGORY)
        // =========================
        getActiveOnboardingVideo: builder.query({
            query: (category) => {
                if (category) {
                    return `/onboarding/active/?category=${category}`;
                }
                return "/onboarding/active/";
            },
            providesTags: ["Onboarding"],
        }),

        // =========================
        // 📄 GET SINGLE VIDEO
        // =========================
        getOnboardingVideo: builder.query({
            query: (id) => `/onboarding/${id}/`,
            providesTags: ["Onboarding"],
        }),

        // =========================
        // ➕ CREATE VIDEO
        // =========================
        createOnboardingVideo: builder.mutation({
            query: (formData) => ({
                url: "/onboarding/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Onboarding"],
        }),

        // =========================
        // ✏️ UPDATE VIDEO
        // =========================
        updateOnboardingVideo: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/onboarding/${id}/`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Onboarding"],
        }),

        // =========================
        // 🗑 DELETE VIDEO
        // =========================
        deleteOnboardingVideo: builder.mutation({
            query: (id) => ({
                url: `/onboarding/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Onboarding"],
        }),

        // =========================
        // 🚀 ACTIVATE VIDEO (CATEGORY SAFE)
        // =========================
        activateVideo: builder.mutation({
            query: (id) => ({
                url: `/onboarding/${id}/activate/`,
                method: "POST",
            }),
            invalidatesTags: ["Onboarding"],
        }),
    }),
});

export const {
    useGetOnboardingVideosQuery,
    useGetActiveOnboardingVideoQuery,
    useGetOnboardingVideoQuery,
    useCreateOnboardingVideoMutation,
    useUpdateOnboardingVideoMutation,
    useDeleteOnboardingVideoMutation,
    useActivateVideoMutation,
} = onboardingApi;