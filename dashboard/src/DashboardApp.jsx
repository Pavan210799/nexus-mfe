import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Bell, Building2, Shield, Sparkles, UserPlus, Users } from "lucide-react";
import { getUsersRequest, getNotificationsRequest } from "@shared/api";
import { getSession } from "@shared/storage";
import { countBy, growthLine } from "@shared/stats";
import { Avatar } from "@shared/components/Avatar";
import { Badge } from "@shared/components/Badge";
import { Button } from "@shared/components/Button";
import { Card } from "@shared/components/Card";
import { ErrorState } from "@shared/components/ErrorState";
import { Spinner } from "@shared/components/Spinner";
import "./index.css";

function hourLabel() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

export default function DashboardApp() {
  const session = getSession();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const userList = await getUsersRequest();
      const noteList = await getNotificationsRequest();
      setUsers(userList);
      setNotes(noteList);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  useEffect(function () {
    loadData();
  }, []);

  if (loading) {
    return <Spinner label="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState text={error} onRetry={loadData} />;
  }

  let adminCount = 0;
  let modCount = 0;
  let unread = 0;

  for (let i = 0; i < users.length; i++) {
    if (users[i].role === "admin") {
      adminCount = adminCount + 1;
    }
    if (users[i].role === "moderator") {
      modCount = modCount + 1;
    }
  }

  for (let i = 0; i < notes.length; i++) {
    if (!notes[i].read) {
      unread = unread + 1;
    }
  }

  const depts = countBy(users, "department");
  const recent = users.slice(0, 6);
  const latestNotes = notes.slice(0, 4);
  const trend = growthLine(users);
  const hello = session ? session.name.split(" ")[0] : "there";

  const cards = [
    { label: "People", value: users.length, hint: "Across all departments", icon: Users },
    { label: "Admins", value: adminCount, hint: "Full workspace access", icon: Shield },
    { label: "Moderators", value: modCount, hint: "Team leads", icon: Sparkles },
    { label: "Unread alerts", value: unread, hint: "Needs a look today", icon: Bell }
  ];

  return (
    <div className="page-stack">
      <section className="hero-banner">
        <div>
          <p className="hero-kicker">{hourLabel()}</p>
          <h1 className="hero-title">
            {hello}, here is the workspace pulse
          </h1>
          <p className="hero-lead">
            Headcount, department health, and the latest alerts from every module — all in one host shell.
          </p>
          <div className="hero-actions">
            <Button
              kind="light"
              onClick={function () {
                navigate("/users");
              }}
            >
              <UserPlus size={16} />
              Manage users
            </Button>
            <Button
              kind="ghost"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={function () {
                navigate("/analytics");
              }}
            >
              Open analytics
            </Button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <p>Departments</p>
            <strong>{depts.length}</strong>
          </div>
          <div className="hero-stat">
            <p>This month</p>
            <strong>{trend[trend.length - 1] ? trend[trend.length - 1].joins : 0}</strong>
          </div>
          <div className="hero-stat hero-stat-wide">
            <p>Team size now</p>
            <strong>{users.length} people</strong>
          </div>
        </div>
      </section>

      <div className="stat-grid">
        {cards.map(function (card) {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="stat-card">
              <div className="stat-body">
                <div>
                  <p className="stat-label">{card.label}</p>
                  <p className="stat-value">{card.value}</p>
                  <p className="stat-hint">{card.hint}</p>
                </div>
                <div className="stat-icon">
                  <Icon size={18} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="split-row split-8-4">
        <Card className="fill-card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Team growth</h2>
              <p className="card-sub">Cumulative headcount from January to September</p>
            </div>
          </div>
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trend} margin={{ top: 20, right: 28, left: 12, bottom: 12 }}>
                <defs>
                  <linearGradient id="teamFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="team" stroke="#4f46e5" fill="url(#teamFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="fill-card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Latest alerts</h2>
              <p className="card-sub">Pulled from the notifications module</p>
            </div>
          </div>
          <div className="alert-list">
            {latestNotes.map(function (note) {
              return (
                <div key={note.id} className={"alert-line" + (note.read ? "" : " unread")}>
                  <div className="row-between">
                    <p className="alert-title">{note.title}</p>
                    {note.read ? null : <span className="badge badge-admin">new</span>}
                  </div>
                  <p className="alert-body">{note.body}</p>
                </div>
              );
            })}
          </div>
          <Button
            kind="ghost"
            className="push-end"
            onClick={function () {
              navigate("/notifications");
            }}
          >
            View all alerts
          </Button>
        </Card>
      </div>

      <div className="split-row split-5-7">
        <Card className="fill-card">
          <div className="card-head">
            <div>
              <div className="card-title-row">
                <Building2 size={18} className="text-[var(--accent)]" />
                <h2 className="card-title">Department health</h2>
              </div>
              <p className="card-sub">Radar · headcount in each team</p>
            </div>
          </div>
          <div className="chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={depts} cx="50%" cy="50%" outerRadius="72%" margin={{ top: 16, right: 28, bottom: 16, left: 28 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }} />
                <Radar name="People" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.32} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="fill-card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Recent members</h2>
              <p className="card-sub">Newest people in the shared user list</p>
            </div>
            <Button kind="ghost" onClick={function () { navigate("/users"); }}>
              Open directory
            </Button>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(function (user) {
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
                      <td className="text-muted">{user.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
