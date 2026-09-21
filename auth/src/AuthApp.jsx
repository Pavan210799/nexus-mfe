import { useLocation } from "react-router-dom";
import { LoginPage } from "./LoginPage.jsx";
import { SignupPage } from "./SignupPage.jsx";
import "./index.css";

export default function AuthApp() {
  const location = useLocation();

  if (location.pathname === "/signup") {
    return <SignupPage />;
  }

  return <LoginPage />;
}
