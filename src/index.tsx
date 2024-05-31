import React from "react";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import type { Container } from "react-dom/client";

const container = document.getElementById("root") as Container;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
