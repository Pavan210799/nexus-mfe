export function Spinner(props) {
  const label = props.label || "Loading...";

  return (
    <div className="grid min-h-[320px] place-items-center text-muted">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"></div>
        <p className="font-medium">{label}</p>
      </div>
    </div>
  );
}
