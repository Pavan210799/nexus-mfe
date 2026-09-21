import { Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { Spinner } from "@shared/components/Spinner";

export function RemoteView(props) {
  const Child = props.child;

  return (
    <ErrorBoundary name={props.name}>
      <Suspense fallback={<Spinner label={"Loading " + props.name + "..."} />}>
        <Child />
      </Suspense>
    </ErrorBoundary>
  );
}
