export type AppLanguage = "en" | "zh-CN";
export const LANGUAGE_KEY = "pdf-toolbox-language";

export function readLanguage(storage: Pick<Storage, "getItem"> | null = globalThis.localStorage): AppLanguage {
  return storage?.getItem(LANGUAGE_KEY) === "zh-CN" ? "zh-CN" : "en";
}

export function saveLanguage(language: AppLanguage, storage: Pick<Storage, "setItem"> = globalThis.localStorage) {
  storage.setItem(LANGUAGE_KEY, language);
}
