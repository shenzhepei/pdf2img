import { FileStack, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { saveLanguage, type AppLanguage } from "../i18n/language";

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (language: AppLanguage) => {
    saveLanguage(language);
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.title = language === "zh-CN" ? "PDF 工具箱" : "PDF Toolbox";
  };
  return (
    <header className="app-header">
      <div className="brand"><span className="brand__mark"><FileStack size={20} /></span><span>{t("appName")}</span></div>
      <div className="privacy-note"><ShieldCheck size={16} />{t("privacy")}</div>
      <div className="language-switch" role="group" aria-label={t("language")}>
        {(["en", "zh-CN"] as AppLanguage[]).map((language) => (
          <button className={i18n.language === language ? "is-active" : ""} key={language} onClick={() => changeLanguage(language)} type="button">
            {language === "en" ? "EN" : "中文"}
          </button>
        ))}
      </div>
    </header>
  );
}
