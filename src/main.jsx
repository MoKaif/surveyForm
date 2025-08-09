import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Ensure this is included to apply Tailwind styles
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
