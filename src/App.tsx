import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { CoursePage } from "./pages/CoursePage";
import { DashboardPage } from "./pages/DashboardPage";
import { DocumentPage } from "./pages/DocumentPage";
import { MaterialLabPage } from "./pages/MaterialLabPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProgressPage } from "./pages/ProgressPage";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/labs/material-math" element={<MaterialLabPage />} />
        <Route path="/learn/:documentId" element={<DocumentPage />} />
        <Route path="/assessment/:blockId" element={<DocumentPage />} />
        <Route path="/guide/:guideId" element={<DocumentPage />} />
        <Route path="/resources/:resourceId" element={<DocumentPage />} />
        <Route path="/checklists/:checklistId" element={<DocumentPage />} />
        <Route path="/answers/:answerId" element={<DocumentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

