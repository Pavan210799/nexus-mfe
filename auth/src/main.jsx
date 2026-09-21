import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthApp from "./AuthApp.jsx";
import { seedIfEmpty } from "@shared/seed";
import { getTheme, setTheme } from "@shared/storage";
import "./index.css";

seedIfEmpty();
setTheme(getTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthApp />
    </BrowserRouter>
  </React.StrictMode>
);
