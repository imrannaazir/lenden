import baseApi from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //get balance
    getBalance: builder.query({
      query: () => ({
        url: "/user/get-balance",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBalanceQuery } = userApi;
