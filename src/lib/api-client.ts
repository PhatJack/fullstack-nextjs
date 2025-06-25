import { appContracts } from "@/shared/contract";
import { tsRestFetchApi } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

export const tsr = initTsrReactQuery(appContracts, {
  baseUrl: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000/api/v1",
  baseHeaders: {
    "x-app-source": "ts-rest",
    "content-type": "application/json",
    accept: "application/json",
  },
  validateResponse: true,
  api: async (args) => {
    //This localStorage check is for the client-side only
    // and currently does not work on the server-side
    // so we have to find a way to handle this

    //Temporarily, we are checking if the code is running on the server or client
    // and if it's on the client, we will add the token from localStorage to the
    // request headers.
    if (typeof window === "undefined") {
      return tsRestFetchApi(args);
    }
    const token = localStorage.getItem("token");
    return tsRestFetchApi({
      ...args,
      headers: {
        ...args.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  },
});
