import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "@shared/api";
import { Button } from "@shared/components/Button";
import { TextField } from "@shared/components/TextField";
import { AuthLayout } from "./AuthLayout.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await loginRequest(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setBusy(false);
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="auth-card">
        <p className="auth-kicker">Nexus</p>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-lead">
          Sign in with your workspace account to open the dashboard.
        </p>

        <div className="form-stack">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={function (event) {
              setEmail(event.target.value);
            }}
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={function (event) {
              setPassword(event.target.value);
            }}
            required
            autoComplete="current-password"
          />
        </div>

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="auth-submit">
          <Button type="submit" disabled={busy} className="btn-block">
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </div>

        <p className="auth-footer">
          New here?{" "}
          <Link className="font-semibold text-[var(--accent)]" to="/signup">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
