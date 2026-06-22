// store/slices/authSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TokenPayload } from "../../../../api/extentions/decodeToken";

interface AuthState {
  accessToken: string | null;
  user: TokenPayload | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: TokenPayload;
      }>,
    ) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
      
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isAuthLoading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
