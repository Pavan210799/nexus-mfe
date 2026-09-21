import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  deleteNotificationRequest,
  getNotificationsRequest,
  updateNotificationRequest
} from "@shared/api";
import { Button } from "@shared/components/Button";
import { EmptyState } from "@shared/components/EmptyState";
import { ErrorState } from "@shared/components/ErrorState";
import { PageHeader } from "@shared/components/PageHeader";
import { Spinner } from "@shared/components/Spinner";
import "./index.css";

export default function NotificationsApp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadNotes() {
    setLoading(true);
    setError("");

    try {
      const list = await getNotificationsRequest();
      setItems(list);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  useEffect(function () {
    loadNotes();
  }, []);

  async function markRead(note) {
    const next = await updateNotificationRequest(note.id, { read: true });
    setItems(next);
  }

  async function markAll() {
    let next = items;

    for (let i = 0; i < items.length; i++) {
      if (!items[i].read) {
        next = await updateNotificationRequest(items[i].id, { read: true });
      }
    }

    setItems(next);
  }

  async function removeNote(note) {
    const next = await deleteNotificationRequest(note.id);
    setItems(next);
  }

  if (loading) {
    return <Spinner label="Loading notifications..." />;
  }

  if (error) {
    return <ErrorState text={error} onRetry={loadNotes} />;
  }

  const visible = [];

  for (let i = 0; i < items.length; i++) {
    if (filter === "all" || (filter === "unread" && !items[i].read)) {
      visible.push(items[i]);
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Inbox"
        title="Notifications"
        actions={
          <Button kind="ghost" onClick={markAll}>
            <CheckCheck size={16} />
            Mark all read
          </Button>
        }
      />

      <div className="filter-row">
        <button
          type="button"
          className={"filter-chip" + (filter === "all" ? " active" : "")}
          onClick={function () {
            setFilter("all");
          }}
        >
          All
        </button>
        <button
          type="button"
          className={"filter-chip" + (filter === "unread" ? " active" : "")}
          onClick={function () {
            setFilter("unread");
          }}
        >
          Unread
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No notifications" text="You are all caught up." />
      ) : (
        <div className="note-list">
          {visible.map(function (note) {
            return (
              <article key={note.id} className={"note-card" + (note.read ? "" : " unread")}>
                <div className="stat-icon">
                  <Bell size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="row-between">
                    <div>
                      <p className="note-title">{note.title}</p>
                      <p className="note-body">{note.body}</p>
                      <p className="note-time">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="note-actions">
                      {note.read ? null : (
                        <Button kind="ghost" onClick={function () { markRead(note); }}>
                          Mark read
                        </Button>
                      )}
                      <Button
                        kind="danger"
                        className="btn-icon"
                        title="Delete"
                        onClick={function () { removeNote(note); }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
