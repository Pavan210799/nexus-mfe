export function Button(props) {
  const kind = props.kind || "primary";
  let className = "btn btn-" + kind;

  if (props.className) {
    className = className + " " + props.className;
  }

  return (
    <button
      type={props.type || "button"}
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      aria-label={props.ariaLabel || props.title}
    >
      {props.children}
    </button>
  );
}
