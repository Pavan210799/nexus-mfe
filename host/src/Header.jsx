import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { getTheme, setTheme } from "@shared/storage";
import { logoutRequest } from "@shared/api";
import { Button } from "@shared/components/Button";
import { useSession } from "./SessionProvider";

export function Header(props) {
  const session = useSession();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [theme, setThemeState] = useState(getTheme());

  async function handleLogout() {
    setBusy(true);

    try {
      await logoutRequest();
      navigate("/login");
    } catch (err) {
      window.alert("Logout request failed");
    }

    setBusy(false);
  }

  function handleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3.5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="btn btn-ghost btn-icon menu-btn"
          onClick={props.onMenu}
          type="button"
          title="Open menu"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Workspace</p>
          <p className="font-bold text-main">Operations</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-ghost btn-icon" type="button" onClick={handleTheme}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          className="btn btn-ghost btn-icon relative"
          type="button"
          onClick={function () {
            navigate("/notifications");
          }}
        >
          <Bell size={16} />
          {session.unread > 0 ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)] pulse-dot"></span>
          ) : null}
        </button>
        <Button kind="ghost" onClick={handleLogout} disabled={busy}>
          {busy ? "Signing out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}
