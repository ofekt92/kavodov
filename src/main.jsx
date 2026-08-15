import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";          // sets <html lang/dir> before the first render
import "./App.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
