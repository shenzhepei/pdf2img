import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { ToolSidebar, type ToolId } from "./components/ToolSidebar";
import { PdfWorkspace } from "./features/PdfWorkspace";

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>("convert");
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <ToolSidebar active={activeTool} onChange={setActiveTool} />
        <PdfWorkspace tool={activeTool} />
      </div>
    </div>
  );
}
