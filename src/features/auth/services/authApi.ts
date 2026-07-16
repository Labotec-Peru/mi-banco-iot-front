import { apiSlice } from "../../../app/apiSlice";
import { loginAPI, type UserAPIType } from "./loginService";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserAPIType, { username: string; clave: string }>({
      async queryFn({ username, clave }) {
        try {
          const userData = await loginAPI(username, clave);
          return { data: userData };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Fallo en la autenticación multi-tenant",
            },
          };
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
