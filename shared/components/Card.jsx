export function Card(props) {
  let className = "bg-card";

  if (props.className) {
    className = className + " " + props.className;
  }

  return <div className={className}>{props.children}</div>;
}
