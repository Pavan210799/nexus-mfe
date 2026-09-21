import { Component } from "react";
import { ErrorState } from "@shared/components/ErrorState";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <ErrorState
          text={this.props.name + " module could not be loaded. Start all remotes and refresh."}
          onRetry={function () {
            window.location.reload();
          }}
        />
      );
    }

    return this.props.children;
  }
}
