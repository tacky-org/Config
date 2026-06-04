export interface AppConfig {
  apiUrl: string;
  timeout: number;
  darkMode: boolean;
}

export function validateAppConfig(raw: unknown): AppConfig {
  const r = raw as AppConfig;
  if (typeof r?.apiUrl !== "string") throw new Error("Invalid apiUrl");
  if (typeof r?.timeout !== "number") throw new Error("Invalid timeout");
  if (typeof r?.darkMode !== "boolean") throw new Error("Invalid darkMode");
  return r;
}

export const STATIC_APP_CONFIG: AppConfig = {
  apiUrl: "https://api.example.com",
  timeout: 3000,
  darkMode: false,
};
