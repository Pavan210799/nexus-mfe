export function Avatar(props) {
  const name = props.name || "User";
  const parts = name.split(" ");
  let initials = parts[0].charAt(0);

  if (parts.length > 1) {
    initials = initials + parts[1].charAt(0);
  }

  let className = "avatar";
  if (props.className) {
    className = className + " " + props.className;
  }

  return <div className={className}>{initials.toUpperCase()}</div>;
}
