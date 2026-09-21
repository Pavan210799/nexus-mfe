import { AuthBackground } from "@shared/components/AuthBackground";

export function AuthLayout(props) {
  return (
    <div className="auth-shell">
      <AuthBackground />
      <section className="auth-copy">
        <p className="auth-copy-kicker">NEXUS ADMIN</p>
        <h2 className="auth-copy-title">
          One shell. Five independent modules. One premium workspace.
        </h2>
        <p className="auth-copy-lead">
          Authentication, users, analytics, and alerts stay in their own apps, then load into this host at runtime.
        </p>
        <div className="auth-copy-list">
          <p>Protected routes with a shared session</p>
          <p>Indigo light and dark workspace</p>
          <p>Live charts from the same local user list</p>
        </div>
      </section>
      <div className="auth-form-wrap">{props.children}</div>
    </div>
  );
}
