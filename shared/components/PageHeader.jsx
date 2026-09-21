export function PageHeader(props) {
  return (
    <div className="page-header">
      <div>
        {props.kicker ? <p className="page-kicker">{props.kicker}</p> : null}
        <h1 className="page-title">{props.title}</h1>
        {props.text ? <p className="page-sub">{props.text}</p> : null}
      </div>
      {props.actions ? <div className="btn-row">{props.actions}</div> : null}
    </div>
  );
}
