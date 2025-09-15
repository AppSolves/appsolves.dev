import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./css/index.css";
import { security } from "./utils/security";

// Initialize security measures
security.initialize();

createRoot(document.getElementById("root")!).render(<App />);
