import { useSelector } from "react-redux";
import type { RootState } from "../../components/layouts/store/store";
import { Navigate, Outlet } from "react-router-dom";

export default function UserGuad() {
  const { accessToken, user, isAuthLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  if (isAuthLoading) return null;
  if (!accessToken) return <Navigate to="/login" replace />;
  const roles = user?.roles?.split(";") || [];
  console.log(roles);
  if (!roles.includes("user") && !roles.includes("admin")) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
