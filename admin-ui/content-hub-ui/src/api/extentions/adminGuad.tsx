import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../components/layouts/store/store";

export default function AdminGuard() {
  const { accessToken, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!accessToken) {
    return <Navigate to="/404" replace />;
  }

  if (user?.roles !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}