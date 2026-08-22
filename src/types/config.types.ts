export type Theme = "light" | "dark" | "system";

export type DisplayConfig = {
  location: boolean;
  time: boolean;
  themeSwitcher: boolean;
};

export type RoutesConfig = Record<string, boolean>;

export type StyleConfig = {
  theme: Theme;
  neutral: string;
  brand: string;
  accent: string;
  border: string;
  surface: string;
  scaling: string;
};
