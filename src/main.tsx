import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { CourseProgressProvider } from "./state/progress";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/markdown.css";
import "highlight.js/styles/github-dark-dimmed.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CourseProgressProvider>
        <App />
      </CourseProgressProvider>
    </BrowserRouter>
  </StrictMode>,
);

