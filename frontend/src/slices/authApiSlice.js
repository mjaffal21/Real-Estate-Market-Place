import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/sign-in`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/sign-up`,
        method: "POST",
        body: data,
      }),
    }),
    google: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/google`,
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleMutation,
  useLogoutUserMutation,
} = authApiSlice;
