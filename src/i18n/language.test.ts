import { describe, expect, it } from "vitest";
import { LANGUAGE_KEY, readLanguage, saveLanguage } from "./language";

describe("language preference", () => {
  it("defaults invalid and missing values to English", () => {
    expect(readLanguage({ getItem: () => null })).toBe("en");
    expect(readLanguage({ getItem: () => "fr" })).toBe("en");
  });

  it("restores and saves Simplified Chinese", () => {
    expect(readLanguage({ getItem: () => "zh-CN" })).toBe("zh-CN");
    const values = new Map<string, string>();
    saveLanguage("zh-CN", { setItem: (key, value) => values.set(key, value) });
    expect(values.get(LANGUAGE_KEY)).toBe("zh-CN");
  });
});
