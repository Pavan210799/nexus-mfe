export function Badge(props) {
  const role = props.role || "user";
  return <span className={"badge badge-" + role}>{role}</span>;
}
