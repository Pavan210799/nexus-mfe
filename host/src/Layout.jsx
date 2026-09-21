import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-page shell">
      <Sidebar />
      {open ? (
        <div className="sidebar-drawer">
          <div
            className="sidebar-backdrop"
            onClick={function () {
              setOpen(false);
            }}
          ></div>
          <Sidebar
            mobile
            onNavigate={function () {
              setOpen(false);
            }}
          />
        </div>
      ) : null}

      <div className="shell-main">
        <Header
          onMenu={function () {
            setOpen(true);
          }}
        />
        <main className="page-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
