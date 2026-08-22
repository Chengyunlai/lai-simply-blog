"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { dispatchConfigUpdated, type DisplayConfig } from "@/lib/configEvents";

interface Config {
  site: {
    baseURL: string;
    basePath: string;
    title: { en: string; zh: string };
    description: { en: string; zh: string };
  };
  person: {
    name: string;
    role: { en: string; zh: string };
    avatar: string;
    email: string;
    location: string;
    locationLabel: string;
  };
  about: {
    intro: {
      display: boolean;
      title: { en: string; zh: string };
      description: { en: string; zh: string };
    };
  };
  social: { name: string; link: string }[];
  theme: {
    style: { theme: string; articleStyle: string };
    display: { location: boolean; time: boolean; themeSwitcher: boolean; languageSwitcher: boolean };
  };
  navigation: {
    routes: Record<string, boolean>;
  };
}

const defaultConfig: Config = {
  site: {
    baseURL: "https://example.com",
    basePath: "",
    title: { en: "Lai Simply Blog", zh: "我的博客" },
    description: { en: "A minimal personal blog built with Next.js", zh: "一个基于 Next.js 的简洁个人博客" },
  },
  person: {
    name: "Your Name",
    role: { en: "Developer", zh: "开发者" },
    avatar: "/images/avatar.svg",
    email: "",
    location: "UTC",
    locationLabel: "Your City",
  },
  about: {
    intro: {
      display: true,
      title: { en: "About Me", zh: "关于我" },
      description: { en: "Write your self-introduction here.", zh: "在这里写你的自我介绍。" },
    },
  },
  social: [{ name: "GitHub", link: "https://github.com/username" }],
  theme: {
    style: { theme: "light", articleStyle: "default" },
    display: { location: true, time: true, themeSwitcher: true, languageSwitcher: true },
  },
  navigation: {
    routes: { "/": true, "/work": true, "/blog": true },
  },
};

function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source || {})) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("site");

  // Preview display options in real-time
  const applyPreview = (key: keyof DisplayConfig, value: boolean) => {
    dispatchConfigUpdated({
      theme: { display: { ...config.theme.display, [key]: value } },
    });
  };

  // Preview navigation in real-time
  const applyNavPreview = (path: string, enabled: boolean) => {
    const nav = document.querySelector('.header-nav');
    if (!nav) return;

    const links = nav.querySelectorAll('a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.endsWith(path)) {
        (link as HTMLElement).style.display = enabled ? '' : 'none';
      }
    });
  };

  // Preview article style in real-time
  const applyArticleStylePreview = (style: string) => {
    const content = document.querySelector('.article-content');
    if (content) {
      content.setAttribute('data-theme-style', style);
    }
    // Also update the preview in settings
    const preview = document.querySelector('.style-preview-content');
    if (preview) {
      preview.setAttribute('data-theme-style', style);
    }
  };

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(deepMerge(defaultConfig, data.config));
        }
      })
      .catch(() => {
        console.error("Failed to load config");
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(t("save_success"));
        dispatchConfigUpdated({ theme: { display: config.theme.display } });
        // Refresh server components to pick up new config
        router.refresh();
      } else {
        setMessage(t("save_failed"));
      }
    } catch {
      setMessage(t("save_failed"));
    }
    setSaving(false);
  };

  const updateConfig = (path: string, value: any) => {
    const keys = path.split(".");
    const newConfig = JSON.parse(JSON.stringify(config));
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Auto-sync locationLabel when name changes
    if (path === "person.name") {
      const oldLabel = config.person.locationLabel;
      const oldName = config.person.name;
      // Only sync if locationLabel still contains the old name or is default
      if (oldLabel === "Your Name / City" || oldLabel.includes(oldName)) {
        newConfig.person.locationLabel = `${value} / City`;
      }
    }

    setConfig(newConfig);
  };

  const tabs = [
    { id: "site", label: t("tab_site") },
    { id: "person", label: t("tab_person") },
    { id: "about", label: t("tab_about") },
    { id: "social", label: t("tab_social") },
    { id: "navigation", label: t("tab_navigation") },
    { id: "theme", label: t("tab_theme") },
  ];

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>{t("title")}</h1>
        <p>{t("subtitle")}</p>
      </header>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === "site" && (
          <section className="settings-section">
            <h2>{t("tab_site")}</h2>
            <div className="form-group">
              <label>{t("site_base_url")}</label>
              <input
                type="url"
                value={config.site.baseURL}
                onChange={(e) => updateConfig("site.baseURL", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label>{t("site_base_path")}</label>
              <input
                type="text"
                value={config.site.basePath}
                onChange={(e) => updateConfig("site.basePath", e.target.value)}
                placeholder="/lai-simply-blog"
              />
              <span className="form-hint">{t("site_base_path_hint")}</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("site_title_en")}</label>
                <input
                  type="text"
                  value={config.site.title.en}
                  onChange={(e) => updateConfig("site.title.en", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>{t("site_title_zh")}</label>
                <input
                  type="text"
                  value={config.site.title.zh}
                  onChange={(e) => updateConfig("site.title.zh", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("site_desc_en")}</label>
                <textarea
                  value={config.site.description.en}
                  onChange={(e) => updateConfig("site.description.en", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>{t("site_desc_zh")}</label>
                <textarea
                  value={config.site.description.zh}
                  onChange={(e) => updateConfig("site.description.zh", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </section>
        )}

        {activeTab === "person" && (
          <section className="settings-section">
            <h2>{t("tab_person")}</h2>
            <div className="form-group">
              <label>{t("person_name")}</label>
              <input
                type="text"
                value={config.person.name}
                onChange={(e) => updateConfig("person.name", e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("person_role_en")}</label>
                <input
                  type="text"
                  value={config.person.role.en}
                  onChange={(e) => updateConfig("person.role.en", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>{t("person_role_zh")}</label>
                <input
                  type="text"
                  value={config.person.role.zh}
                  onChange={(e) => updateConfig("person.role.zh", e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("person_avatar")}</label>
              <input
                type="text"
                value={config.person.avatar}
                onChange={(e) => updateConfig("person.avatar", e.target.value)}
                placeholder="/images/avatar.svg"
              />
            </div>
            <div className="form-group">
              <label>{t("person_email")}</label>
              <input
                type="email"
                value={config.person.email}
                onChange={(e) => updateConfig("person.email", e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("person_location")}</label>
                <select
                  value={config.person.location}
                  onChange={(e) => updateConfig("person.location", e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                  <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                  <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
                  <option value="America/Chicago">America/Chicago (UTC-6)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                  <option value="Europe/Berlin">Europe/Berlin (UTC+1)</option>
                  <option value="Australia/Sydney">Australia/Sydney (UTC+11)</option>
                  <option value="Pacific/Auckland">Pacific/Auckland (UTC+13)</option>
                </select>
                <p className="form-hint">{t("timezone_hint")}</p>
              </div>
              <div className="form-group">
                <label>{t("person_location_label")}</label>
                <div className="input-with-preview">
                  <input
                    type="text"
                    value={config.person.locationLabel}
                    onChange={(e) => updateConfig("person.locationLabel", e.target.value)}
                    placeholder={`${config.person.name} / City`}
                  />
                  <span className="input-preview">{t("preview")}: <strong>{config.person.locationLabel || `${config.person.name} / City`}</strong></span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section className="settings-section">
            <h2>{t("tab_about")}</h2>
            <div className="form-check">
              <input
                type="checkbox"
                id="about-display"
                checked={config.about.intro.display}
                onChange={(e) => updateConfig("about.intro.display", e.target.checked)}
              />
              <label htmlFor="about-display">{t("about_show_intro")}</label>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("about_title_en")}</label>
                <input
                  type="text"
                  value={config.about.intro.title.en}
                  onChange={(e) => updateConfig("about.intro.title.en", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>{t("about_title_zh")}</label>
                <input
                  type="text"
                  value={config.about.intro.title.zh}
                  onChange={(e) => updateConfig("about.intro.title.zh", e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("about_desc_en")}</label>
              <textarea
                value={config.about.intro.description.en}
                onChange={(e) => updateConfig("about.intro.description.en", e.target.value)}
                rows={6}
                placeholder="Write about yourself... (Markdown supported)"
              />
              <p className="form-hint">{t("about_markdown_hint")}</p>
            </div>
            <div className="form-group">
              <label>{t("about_desc_zh")}</label>
              <textarea
                value={config.about.intro.description.zh}
                onChange={(e) => updateConfig("about.intro.description.zh", e.target.value)}
                rows={6}
                placeholder="写一些关于你的内容...（支持 Markdown）"
              />
              <p className="form-hint">{t("about_markdown_hint")}</p>
            </div>
          </section>
        )}

        {activeTab === "social" && (
          <section className="settings-section">
            <h2>{t("tab_social")}</h2>
            {config.social.map((item, index) => (
              <div key={index} className="social-item">
                <div className="social-fields">
                  <div className="form-group">
                    <label>{t("social_platform")}</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newSocial = [...config.social];
                        newSocial[index] = { ...item, name: e.target.value };
                        updateConfig("social", newSocial);
                      }}
                      placeholder="GitHub"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t("social_link")}</label>
                    <input
                      type="url"
                      value={item.link}
                      onChange={(e) => {
                        const newSocial = [...config.social];
                        newSocial[index] = { ...item, link: e.target.value };
                        updateConfig("social", newSocial);
                      }}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                <button
                  className="social-delete"
                  onClick={() => {
                    const newSocial = config.social.filter((_, i) => i !== index);
                    updateConfig("social", newSocial);
                  }}
                  aria-label={t("social_delete")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary"
              onClick={() => {
                updateConfig("social", [...config.social, { name: "", link: "" }]);
              }}
            >
              {t("social_add")}
            </button>
          </section>
        )}

        {activeTab === "navigation" && (
          <section className="settings-section">
            <h2>{t("tab_navigation")}</h2>
            <p className="form-hint">{t("nav_hint")}</p>
            {Object.entries(config.navigation.routes).map(([path, enabled]) => (
              <div key={path} className="form-check">
                <input
                  type="checkbox"
                  id={`route-${path}`}
                  checked={enabled}
                  onChange={(e) => {
                    updateConfig(`navigation.routes.${path}`, e.target.checked);
                    applyNavPreview(path, e.target.checked);
                  }}
                />
                <label htmlFor={`route-${path}`}>
                  <code>{path}</code>
                </label>
              </div>
            ))}
          </section>
        )}

        {activeTab === "theme" && (
          <section className="settings-section">
            <h2>{t("tab_theme")}</h2>
            <div className="form-group">
              <label>{t("theme_default")}</label>
              <select
                value={config.theme.style.theme}
                onChange={(e) => updateConfig("theme.style.theme", e.target.value)}
              >
                <option value="light">{t("theme_light")}</option>
                <option value="dark">{t("theme_dark")}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t("article_style")}</label>
              <div className="style-options">
                {[
                  { id: "default", name: "Default", desc: t("style_default_desc") },
                  { id: "github", name: "GitHub", desc: t("style_github_desc") },
                  { id: "notion", name: "Notion", desc: t("style_notion_desc") },
                  { id: "academic", name: "Academic", desc: t("style_academic_desc") },
                ].map((style) => (
                  <div
                    key={style.id}
                    className={`style-option ${config.theme.style.articleStyle === style.id ? "active" : ""}`}
                    onClick={() => {
                      updateConfig("theme.style.articleStyle", style.id);
                      applyArticleStylePreview(style.id);
                    }}
                  >
                    <div className="style-option-header">
                      <span className="style-option-name">{style.name}</span>
                      {config.theme.style.articleStyle === style.id && (
                        <span className="style-option-check">✓</span>
                      )}
                    </div>
                    <p className="style-option-desc">{style.desc}</p>
                  </div>
                ))}
              </div>
              <div className="style-preview">
                <div className="style-preview-header">{t("preview")}</div>
                <div className="style-preview-content article-content" data-theme-style={config.theme.style.articleStyle}>
                  <h3>{t("preview_title")}</h3>
                  <p>{t("preview_text")}</p>
                  <pre><code>const hello = "world";</code></pre>
                  <blockquote><p>{t("preview_quote")}</p></blockquote>
                </div>
              </div>
            </div>
            <h3>{t("display_options")}</h3>
            <div className="form-check">
              <input
                type="checkbox"
                id="display-location"
                checked={config.theme.display.location}
                onChange={(e) => {
                  updateConfig("theme.display.location", e.target.checked);
                  applyPreview("location", e.target.checked);
                }}
              />
              <label htmlFor="display-location">{t("display_location")}</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="display-time"
                checked={config.theme.display.time}
                onChange={(e) => {
                  updateConfig("theme.display.time", e.target.checked);
                  applyPreview("time", e.target.checked);
                }}
              />
              <label htmlFor="display-time">{t("display_time")}</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="display-theme-switcher"
                checked={config.theme.display.themeSwitcher}
                onChange={(e) => {
                  updateConfig("theme.display.themeSwitcher", e.target.checked);
                  applyPreview("themeSwitcher", e.target.checked);
                }}
              />
              <label htmlFor="display-theme-switcher">{t("display_theme_switcher")}</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="display-language-switcher"
                checked={config.theme.display.languageSwitcher}
                onChange={(e) => {
                  updateConfig("theme.display.languageSwitcher", e.target.checked);
                  applyPreview("languageSwitcher", e.target.checked);
                }}
              />
              <label htmlFor="display-language-switcher">{t("display_language_switcher")}</label>
            </div>
          </section>
        )}
      </div>

      <div className="settings-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t("saving") : t("save")}
        </button>
        {message && <span className={`settings-message ${message.includes(t("save_failed")) ? "error" : "success"}`}>{message}</span>}
      </div>
    </div>
  );
}
