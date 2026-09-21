import { Button } from "./Button";

export function ErrorState(props) {
  return (
    <div className="bg-card error-state">
      <p className="card-title">Something went wrong</p>
      <p className="card-sub">{props.text}</p>
      {props.onRetry ? (
        <div className="error-actions">
          <Button onClick={props.onRetry}>Try again</Button>
        </div>
      ) : null}
    </div>
  );
}
