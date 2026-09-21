import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Pencil, Trash2 } from "lucide-react";
import {
  addUserRequest,
  deleteUserRequest,
  getUsersRequest,
  updateUserRequest
} from "@shared/api";
import { Avatar } from "@shared/components/Avatar";
import { Badge } from "@shared/components/Badge";
import { Button } from "@shared/components/Button";
import { Card } from "@shared/components/Card";
import { EmptyState } from "@shared/components/EmptyState";
import { ErrorState } from "@shared/components/ErrorState";
import { Modal } from "@shared/components/Modal";
import { PageHeader } from "@shared/components/PageHeader";
import { Spinner } from "@shared/components/Spinner";
import { TextField } from "@shared/components/TextField";
import "./index.css";

const pageSize = 10;

const emptyForm = {
  name: "",
  email: "",
  password: "123456",
  role: "user",
  department: "Support",
  phone: ""
};

export default function UsersApp() {
  const [params] = useSearchParams();
  const roleFromUrl = params.get("role") || "all";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(roleFromUrl === "admin" || roleFromUrl === "moderator" || roleFromUrl === "user" ? roleFromUrl : "all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const list = await getUsersRequest();
      setUsers(list);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  useEffect(function () {
    loadUsers();
  }, []);

  useEffect(function () {
    const nextRole = params.get("role") || "all";
    if (nextRole === "admin" || nextRole === "moderator" || nextRole === "user" || nextRole === "all") {
      setRole(nextRole);
      setPage(1);
    }
  }, [params]);

  function changeField(key, value) {
    setForm({
      ...form,
      [key]: value
    });
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(user) {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
      phone: user.phone
    });
    setOpen(true);
  }

  async function saveUser(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (editing) {
        await updateUserRequest(editing.id, form);
      } else {
        await addUserRequest(form);
        setQuery("");
        setRole("all");
        setPage(1);
      }
      setOpen(false);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }

    setBusy(false);
  }

  async function removeUser(user) {
    const ok = window.confirm("Delete " + user.name + "?");
    if (!ok) {
      return;
    }

    try {
      await deleteUserRequest(user.id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const blob = (user.name + " " + user.email + " " + user.role + " " + user.department).toLowerCase();
    const roleOk = role === "all" || user.role === role;
    if (roleOk && blob.indexOf(query.toLowerCase()) !== -1) {
      filtered.push(user);
    }
  }

  const pageCount = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = page > pageCount ? 1 : page;
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const chips = ["all", "admin", "moderator", "user"];

  if (loading) {
    return <Spinner label="Loading users..." />;
  }

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Directory"
        title="User Management"
        actions={<Button onClick={openAdd}>Add user</Button>}
      />

      <Card className="search-bar">
        <label className="search-field">
          <Search size={16} className="search-icon" />
          <input
            className="field"
            placeholder="Search name, email, role, or team"
            value={query}
            onChange={function (event) {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <div className="filter-row">
          {chips.map(function (chip) {
            return (
              <button
                key={chip}
                type="button"
                className={"filter-chip" + (role === chip ? " active" : "")}
                onClick={function () {
                  setRole(chip);
                  setPage(1);
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </Card>

      {error ? <ErrorState text={error} onRetry={loadUsers} /> : null}

      {!error && filtered.length === 0 ? (
        <EmptyState title="No users found" text="Try another search or add a user." />
      ) : null}

      {!error && filtered.length > 0 ? (
        <Card>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(function (user) {
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="person">
                          <Avatar name={user.name} />
                          <div>
                            <p className="font-semibold text-main">{user.name}</p>
                            <p className="text-xs text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge role={user.role} />
                      </td>
                      <td>{user.department}</td>
                      <td className="text-muted">{user.phone}</td>
                      <td className="text-muted">{user.createdAt}</td>
                      <td>
                        <div className="icon-actions">
                          <Button
                            kind="ghost"
                            className="btn-icon"
                            title="Edit"
                            onClick={function () { openEdit(user); }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            kind="danger"
                            className="btn-icon"
                            title="Delete"
                            onClick={function () { removeUser(user); }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <p className="text-sm text-muted">
              Page {safePage} of {pageCount}
            </p>
            <div className="btn-row">
              <Button
                kind="ghost"
                disabled={safePage <= 1}
                onClick={function () {
                  setPage(safePage - 1);
                }}
              >
                Previous
              </Button>
              <Button
                kind="ghost"
                disabled={safePage >= pageCount}
                onClick={function () {
                  setPage(safePage + 1);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Modal open={open} title={editing ? "Edit user" : "Add user"}>
        <form className="form-grid" onSubmit={saveUser}>
          <div className="form-span-2">
            <TextField
              label="Name"
              value={form.name}
              onChange={function (event) {
                changeField("name", event.target.value);
              }}
              required
            />
          </div>
          <div className="form-span-2">
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={function (event) {
                changeField("email", event.target.value);
              }}
              required
            />
          </div>
          {editing ? null : (
            <div className="form-span-2">
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={function (event) {
                  changeField("password", event.target.value);
                }}
                required
              />
            </div>
          )}
          <label className="field-label">
            Role
            <select
              className="field"
              value={form.role}
              onChange={function (event) {
                changeField("role", event.target.value);
              }}
            >
              <option value="admin">admin</option>
              <option value="moderator">moderator</option>
              <option value="user">user</option>
            </select>
          </label>
          <TextField
            label="Department"
            value={form.department}
            onChange={function (event) {
              changeField("department", event.target.value);
            }}
          />
          <div className="form-span-2">
            <TextField
              label="Phone"
              value={form.phone}
              onChange={function (event) {
                changeField("phone", event.target.value);
              }}
            />
          </div>
          <div className="btn-row form-span-2 form-actions">
            <Button
              kind="ghost"
              type="button"
              onClick={function () {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
