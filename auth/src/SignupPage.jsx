import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupRequest } from "@shared/api";
import { Button } from "@shared/components/Button";
import { TextField } from "@shared/components/TextField";
import { AuthLayout } from "./AuthLayout.jsx";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await signupRequest(name, email, password);
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
        <h1 className="auth-title">Create account</h1>
        <p className="auth-lead">
          Your profile is saved in this browser and can sign in right away.
        </p>

        <div className="form-stack">
          <TextField
            label="Full name"
            value={name}
            onChange={function (event) {
              setName(event.target.value);
            }}
            required
          />
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
            autoComplete="new-password"
          />
        </div>

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="auth-submit">
          <Button type="submit" disabled={busy} className="btn-block">
            {busy ? "Creating..." : "Sign up"}
          </Button>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link className="font-semibold text-[var(--accent)]" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
