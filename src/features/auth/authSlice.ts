import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import type { UserAPIType } from "./services/loginService";
interface AuthState {
  user: Omit<UserAPIType, "accessToken" | "tokenType"> | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null, isAuthenticated: false };
  }

  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  return {
    token: storedToken,
    isAuthenticated: !!storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

const persistAuth = (state: AuthState) => {
  if (typeof window === "undefined") return;

  if (state.token) {
    localStorage.setItem("token", state.token);
    localStorage.setItem("user", JSON.stringify(state.user));
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

const initialState: AuthState = {
  ...getStoredAuth(),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      persistAuth(state);
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const { accessToken, tokenType, ...restOfUser } = action.payload;

        state.token = accessToken;
        state.isAuthenticated = true;
        state.user = restOfUser;
        state.error = null;

        persistAuth(state);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        const backendError = action.payload as any;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        state.error =
          backendError?.errorCode?.message ||
          backendError?.messageType ||
          "No se pudo iniciar sesión.";

        persistAuth(state);
      });
  },
});

export const { clearAuthError, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;