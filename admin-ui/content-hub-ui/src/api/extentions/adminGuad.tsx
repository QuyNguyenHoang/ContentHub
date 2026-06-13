import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../components/layouts/store/store";

export default function AdminGuard() {
  const { accessToken, user, isAuthLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isAuthLoading) return null;

  if (!accessToken) return <Navigate to="/404" replace />;

  const roles = user?.roles?.split(";") || [];

  if (!roles.includes("admin")) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
