declare module "../../content/blog.config" {
  const config: {
    site?: {
      baseURL?: string;
      title?: { en?: string; zh?: string };
      description?: { en?: string; zh?: string };
    };
    person?: {
      name?: string;
      role?: { en?: string; zh?: string };
      avatar?: string;
      email?: string;
      location?: string;
      locationLabel?: string;
    };
    social?: Array<{ name: string; link: string }>;
    theme?: {
      style?: { theme?: string };
      display?: { location?: boolean; time?: boolean; themeSwitcher?: boolean };
    };
    navigation?: {
      routes?: Record<string, boolean>;
    };
  };
  export default config;
}
