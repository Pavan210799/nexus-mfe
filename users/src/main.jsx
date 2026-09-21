import React from "react";
import ReactDOM from "react-dom/client";
import UsersApp from "./UsersApp.jsx";
import { seedIfEmpty } from "@shared/seed";
import { getTheme, setTheme } from "@shared/storage";
import "./index.css";

seedIfEmpty();
setTheme(getTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UsersApp />
  </React.StrictMode>
);
