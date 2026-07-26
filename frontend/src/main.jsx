import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/style.css";
import "./components/ErrorBoundary/ErrorBoundary.css";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import AppProvider from "./app/providers/AppProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
<ErrorBoundary>
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
</ErrorBoundary>
);