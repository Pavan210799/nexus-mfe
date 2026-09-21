import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./SessionProvider";

export function GuestRoute() {
  const session = useSession();

  if (session.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
