export function Card(props) {
  let className = "bg-card";

  if (props.className) {
    className = className + " " + props.className;
  }

  if (props.onClick) {
    return (
      <button type="button" className={className} onClick={props.onClick}>
        {props.children}
      </button>
    );
  }

  return <div className={className}>{props.children}</div>;
}
