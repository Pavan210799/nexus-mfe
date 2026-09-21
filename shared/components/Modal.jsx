export function Modal(props) {
  if (!props.open) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="bg-card modal-panel">
        <h3 className="modal-title">{props.title}</h3>
        <div className="modal-body">{props.children}</div>
      </div>
    </div>
  );
}
