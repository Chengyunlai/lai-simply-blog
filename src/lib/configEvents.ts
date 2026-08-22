export type DisplayConfig = {
  location: boolean;
  time: boolean;
  themeSwitcher: boolean;
  languageSwitcher: boolean;
};

export type ConfigUpdatedDetail = {
  theme?: {
    display?: Partial<DisplayConfig>;
  };
};

export const CONFIG_UPDATED_EVENT = "lai-simply-blog:config-updated";

export function dispatchConfigUpdated(detail: ConfigUpdatedDetail) {
  window.dispatchEvent(new CustomEvent(CONFIG_UPDATED_EVENT, { detail }));
}
