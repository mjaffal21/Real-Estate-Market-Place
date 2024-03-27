import { apiSlice } from "./apiSlice";
import { LISTS_URL, UPLOADS_URL } from "../constants";

export const listApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    photoUpload: builder.mutation({
      query: (data) => ({
        url: UPLOADS_URL,
        method: "POST",
        body: data,
      }),
    }),
    createList: builder.mutation({
      query: (data) => ({
        url: `${LISTS_URL}/create-list`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["List"],
    }),
    deleteList: builder.mutation({
      query: ({ id }) => ({
        url: `${LISTS_URL}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["List"],
    }),
    getList: builder.query({
      query: (id) => ({
        url: `${LISTS_URL}/listing/${id}`,
      }),
      providesTags: ["List"],
    }),
    updateList: builder.mutation({
      query: (data) => ({
        url: `${LISTS_URL}/update-listing/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["List"],
    }),
    searchListings: builder.query({
      query: (sideBarData) => ({
        url: `${LISTS_URL}/get`,
        params: {
          searchTerm: sideBarData.searchTerm,
          offer: sideBarData.offer,
          furnished: sideBarData.furnished,
          parking: sideBarData.parking,
          type: sideBarData.type,
          sort: sideBarData.sort,
          order: sideBarData.order,
          limit: sideBarData.limit,
        },
      }),
      providesTags: ["List"],
      keepUnusedDataFor: 5,
    }),
    getOfferListings: builder.query({
      query: () => `${LISTS_URL}/get?offer=true&limit=4`,
    }),
    getRentListings: builder.query({
      query: () => `${LISTS_URL}/get?type=rent&limit=4`,
    }),
    getSaleListings: builder.query({
      query: () => `${LISTS_URL}/get?type=sale&limit=4`,
    }),
  }),
});

export const {
  usePhotoUploadMutation,
  useCreateListMutation,
  useDeleteListMutation,
  useGetListQuery,
  useUpdateListMutation,
  useSearchListingsQuery,
  useGetOfferListingsQuery,
  useGetRentListingsQuery,
  useGetSaleListingsQuery,
} = listApiSlice;
