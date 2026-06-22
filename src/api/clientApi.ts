import { api } from "../features/apiSlice"

export const clientApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getClients: builder.query<
            any,
            {
                page?: number;
                page_size?: number;
                search?: string;
                district?: string;
                start_date?: any;
                end_date?: any
            }
        >({
            query: (args) => {
                console.log("args", args)
                return {
                    url: "clients/",
                    params: args,
                }

            },

            providesTags: ["Client"],
        }),

        createClient: builder.mutation({
            query: (data) => ({
                url: "clients/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Client"]
        }),

        updateClient: builder.mutation({
            query: ({ id, data }) => ({
                url: `clients/${id}/`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Client"]
        }),

        deleteClient: builder.mutation({
            query: (id) => ({
                url: `clients/${id}/`,
                method: "DELETE"
            }),
            invalidatesTags: ["Client"]
        }),
        searchClients: builder.query<any, string>({
            query: (q) => ({
                url: "/clients/search/",
                params: { q },
            }),
        }),

    })
})

export const {
    useGetClientsQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
    useSearchClientsQuery
} = clientApi