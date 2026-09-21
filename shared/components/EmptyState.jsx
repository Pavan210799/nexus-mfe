export function EmptyState(props) {
  return (
    <div className="bg-card empty-state">
      <p className="card-title">{props.title}</p>
      <p className="card-sub">{props.text}</p>
    </div>
  );
}
