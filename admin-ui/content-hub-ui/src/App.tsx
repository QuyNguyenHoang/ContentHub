import { Suspense, useEffect, useRef, useState } from "react";
import { CSpinner } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import "./components/layouts/styles/scss/style.scss";
import "./components/layouts/styles/scss/examples.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { authApi } from "./api/auth/auth.api";
import { decodeToken } from "./api/extentions/decodeToken";
import { loginSuccess, logout, setAuthLoading } from "./components/layouts/store/slices/authSlice";
import type { RootState } from "./components/layouts/store/store";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector((state: RootState) => state.auth);

 
  const hasRefreshed = useRef(false); // ✅ LOCK

  useEffect(() => {
    const restoreSession = async () => {
      if (hasRefreshed.current) return;
      hasRefreshed.current = true;

      try {
        dispatch(setAuthLoading(true));
        const res = await authApi.refreshTokenApi();

        const token = res.data.token;

        const user = await decodeToken(token);
        console.log(user?.userName);
        if (!user) throw new Error("Invalid token");

        dispatch(loginSuccess({ token, user }));
      } catch (error) {
        console.error("Restore session failed:", error);

        // ✅ CLEAR AUTH STATE
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  if (isAuthLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center vh-100">
          <CSpinner color="primary" />
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  );
}