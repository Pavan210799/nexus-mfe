import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getUsersRequest } from "@shared/api";
import { activityLine, countBy, growthLine, monthlyJoins, roleTrend } from "@shared/stats";
import { Card } from "@shared/components/Card";
import { ErrorState } from "@shared/components/ErrorState";
import { PageHeader } from "@shared/components/PageHeader";
import { Spinner } from "@shared/components/Spinner";
import "./index.css";

const pieColors = ["#4f46e5", "#0ea5e9", "#10b981"];
const chartPad = { top: 20, right: 28, left: 12, bottom: 12 };

function ChartTitle(props) {
  return (
    <div className="card-head">
      <div>
        <h2 className="card-title">{props.title}</h2>
        <p className="card-sub">{props.text}</p>
      </div>
    </div>
  );
}

export default function AnalyticsApp() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <Spinner label="Loading analytics..." />;
  }

  if (error) {
    return <ErrorState text={error} onRetry={loadUsers} />;
  }

  const growth = growthLine(users);
  const roles = countBy(users, "role");
  const depts = countBy(users, "department");
  const joins = monthlyJoins(users);
  const byRole = roleTrend(users);
  const activity = activityLine();

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Insights"
        title="Analytics"
      />

      <div className="split-row split-8-4">
        <Card>
          <ChartTitle title="Team growth" text="Line chart · cumulative headcount" />
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growth} margin={chartPad}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="team" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="joins" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <ChartTitle title="Role mix" text="Pie chart · share of access levels" />
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={chartPad}>
                <Pie data={roles} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {roles.map(function (entry, index) {
                    return <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="split-row split-4-8">
        <Card>
          <ChartTitle title="Departments" text="Bar chart · people in each team" />
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={depts} layout="vertical" margin={{ top: 20, right: 28, left: 16, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <ChartTitle title="Hires by role" text="Line chart · monthly joins for admin, moderator, and user" />
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={byRole} margin={chartPad}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="admin" stroke="#4f46e5" strokeWidth={3} />
                <Line type="monotone" dataKey="moderator" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="user" stroke="#f59e0b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="split-row split-7-5">
        <Card>
          <ChartTitle title="Weekly activity" text="Area + line · active people and sessions" />
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activity} margin={chartPad}>
                <defs>
                  <linearGradient id="activeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sessions" stroke="#0ea5e9" fill="#0ea5e933" strokeWidth={2} />
                <Line type="monotone" dataKey="active" stroke="#4f46e5" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <ChartTitle title="New joins" text="Bar chart · people added each month" />
          <div className="chart-box h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={joins} margin={chartPad}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="joins" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
