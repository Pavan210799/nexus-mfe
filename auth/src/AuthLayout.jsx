import { AuthBackground } from "@shared/components/AuthBackground";

export function AuthLayout(props) {
  return (
    <div className="auth-shell">
      <AuthBackground />
      <section className="auth-copy">
        <p className="auth-copy-kicker">NEXUS</p>
        <h2 className="auth-copy-title">
          The workspace your operations team actually opens every morning.
        </h2>
        <p className="auth-copy-lead">
          See who is on the team, follow growth across departments, and catch alerts before they pile up — all from one signed-in workspace.
        </p>
        <div className="auth-copy-list">
          <p>Invite people and keep roles up to date</p>
          <p>Track headcount and department health</p>
          <p>Stay on top of unread alerts in one inbox</p>
        </div>
      </section>
      <div className="auth-form-wrap">{props.children}</div>
    </div>
  );
}
