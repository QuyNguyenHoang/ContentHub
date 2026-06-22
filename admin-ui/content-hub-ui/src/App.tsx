import { Suspense, useEffect, useRef } from "react";
import { CSpinner } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import "./components/layouts/styles/scss/style.scss";
import "./components/layouts/styles/scss/examples.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { authApi } from "./api/auth/auth.api";
import { decodeToken } from "./api/extentions/decodeToken";
import {
  loginSuccess,
  logout,
  setAuthLoading,
} from "./components/layouts/store/slices/authSlice";
import type { RootState } from "./components/layouts/store/store";

// 🔥 AUTH0 ADD
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector((state: RootState) => state.auth);

  const hasRefreshed = useRef(false);
  const { getIdTokenClaims } = useAuth0();
  const { isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } =
    useAuth0();
  useEffect(() => {
    const syncUser = async () => {
      if (isAuth0Loading) return;
      if (!isAuth0Authenticated) return;
      console.log("auth0 state:", {
        isAuth0Authenticated,
        isAuth0Loading,
      });
      try {
        const claims = await getIdTokenClaims();

        const idToken = claims?.__raw;
        if (!idToken) return;
        console.log("ID",idToken)
        const res = await authApi.googleLogin(idToken);
        const token = res.data.token;
        const user = await decodeToken(token);
        if (!user) return;
        dispatch(loginSuccess({ token, user }));
      } catch (err) {
        console.error("Auth0 token error:", err);
      }
    };

    syncUser();
  }, [isAuth0Authenticated, isAuth0Loading]);

  useEffect(() => {
    const restoreSession = async () => {
      if (hasRefreshed.current) return;
      hasRefreshed.current = true;

      try {
        dispatch(setAuthLoading(true));

        const res = await authApi.refreshTokenApi();
        const token = res.data.token;

        const user = await decodeToken(token);

        if (!user) throw new Error("Invalid token");

        dispatch(loginSuccess({ token, user }));
      } catch (error) {
        console.error("Restore session failed:", error);
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);
  if (isAuthLoading || isAuth0Loading) {
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
