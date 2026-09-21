import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./SessionProvider";

export function ProtectedRoute() {
  const session = useSession();

  if (!session.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
