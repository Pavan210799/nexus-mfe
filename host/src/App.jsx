import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider } from "./SessionProvider.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { GuestRoute } from "./GuestRoute.jsx";
import { Layout } from "./Layout.jsx";
import { RemoteView } from "./RemoteView.jsx";

const AuthApp = lazy(function () {
  return import("auth/AuthApp");
});

const DashboardApp = lazy(function () {
  return import("dashboard/DashboardApp");
});

const UsersApp = lazy(function () {
  return import("users/UsersApp");
});

const AnalyticsApp = lazy(function () {
  return import("analytics/AnalyticsApp");
});

const NotificationsApp = lazy(function () {
  return import("notifications/NotificationsApp");
});

export default function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route
            path="/login"
            element={<RemoteView name="Auth" child={AuthApp} />}
          />
          <Route
            path="/signup"
            element={<RemoteView name="Auth" child={AuthApp} />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<RemoteView name="Dashboard" child={DashboardApp} />}
            />
            <Route
              path="/users"
              element={<RemoteView name="Users" child={UsersApp} />}
            />
            <Route
              path="/analytics"
              element={<RemoteView name="Analytics" child={AnalyticsApp} />}
            />
            <Route
              path="/notifications"
              element={<RemoteView name="Notifications" child={NotificationsApp} />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </SessionProvider>
  );
}
