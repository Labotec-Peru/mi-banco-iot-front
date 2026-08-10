import { apiSlice } from "../../../app/apiSlice";
import { loginAPI, type LoginCredentials, type UserAPIType } from "./loginService";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserAPIType, LoginCredentials>({
      async queryFn({ email, password }) {
        try {
          const userData = await loginAPI(email, password);
          return { data: userData };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Fallo en la autenticación";
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: message,
            },
          };
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
