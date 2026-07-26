import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error(errorInfo);

    this.setState({
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-card">
            <h1>🎬 Oops!</h1>

            <h2>Something went wrong.</h2>

            <p>
              Cine Buddy encountered an unexpected error.
            </p>

            <button
              className="error-btn"
              onClick={this.handleReload}
            >
              Reload Application
            </button>

            {import.meta.env.DEV && (
              <details className="error-details">
                <summary>Developer Details</summary>

                <pre>{this.state.error?.toString()}</pre>

                <pre>
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;