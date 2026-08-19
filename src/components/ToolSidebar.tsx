import { Combine, Images, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ToolId = "convert" | "merge" | "split";
const tools = [
  { id: "convert" as const, icon: Images },
  { id: "merge" as const, icon: Combine },
  { id: "split" as const, icon: Scissors },
];

export function ToolSidebar({ active, onChange }: { active: ToolId; onChange: (tool: ToolId) => void }) {
  const { t } = useTranslation();
  return (
    <nav className="tool-sidebar" aria-label={t("tools")}>
      <p className="eyebrow">{t("tools")}</p>
      {tools.map(({ id, icon: Icon }) => (
        <button className={"tool-nav-item " + (active === id ? "is-active" : "")} key={id} onClick={() => onChange(id)} type="button">
          <Icon size={19} />
          <span><strong>{t(id)}</strong><small>{t(id + "Desc")}</small></span>
        </button>
      ))}
    </nav>
  );
}
