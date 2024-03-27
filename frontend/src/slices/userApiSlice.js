import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-user`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    profile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/delete-user`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUserListings: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}/listings`,
      }),
      providesTags: ["List"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/user/${id}`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useProfileQuery,
  useDeleteUserMutation,
  useGetUserListingsQuery,
  useGetUserQuery,
} = userApiSlice;
