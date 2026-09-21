import { createContext, useContext, useEffect, useState } from "react";
import { getSession, getNotifications } from "@shared/storage";

const SessionContext = createContext(null);

export function SessionProvider(props) {
  const [user, setUser] = useState(getSession);
  const [unread, setUnread] = useState(0);

  function countUnread() {
    const items = getNotifications();
    let total = 0;

    for (let i = 0; i < items.length; i++) {
      if (!items[i].read) {
        total = total + 1;
      }
    }

    return total;
  }

  useEffect(function () {
    function syncSession() {
      setUser(getSession());
    }

    function syncNotes() {
      setUnread(countUnread());
    }

    syncNotes();
    window.addEventListener("session-changed", syncSession);
    window.addEventListener("notes-changed", syncNotes);

    return function () {
      window.removeEventListener("session-changed", syncSession);
      window.removeEventListener("notes-changed", syncNotes);
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user: user, unread: unread }}>
      {props.children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
