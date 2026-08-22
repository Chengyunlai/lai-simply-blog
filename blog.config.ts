// blog.config.ts
// 站点默认配置（开源）
// 用户可在 content/blog.config.ts 中覆盖

const config = {
  site: {
    baseURL: "https://example.com",
    basePath: "",
    title: {
      en: "Lai Simply Blog",
      zh: "我的博客"
    },
    description: {
      en: "A minimal personal blog built with Next.js",
      zh: "一个基于 Next.js 的简洁个人博客"
    },
  },
  person: {
    name: "Your Name",
    role: {
      en: "Developer",
      zh: "开发者"
    },
    avatar: "/images/avatar.svg",
    email: "",
    location: "UTC",
    locationLabel: "Your City",
    languages: ["en", "zh"],
    locale: "en",
  },
  social: [
    { name: "GitHub", link: "https://github.com/username" },
  ],
  navigation: {
    routes: {
      "/": true,
      "/about": true,
      "/work": true,
      "/blog": true,
    } as Record<string, boolean>,
    labels: {
      en: {
        "/": "Home",
        "/about": "About",
        "/work": "Projects",
        "/blog": "Blog",
      },
      zh: {
        "/": "首页",
        "/about": "关于",
        "/work": "项目",
        "/blog": "博客",
      }
    } as Record<string, Record<string, string>>,
  },
  theme: {
    style: {
      theme: "light",
      neutral: "sand",
      brand: "moss",
      accent: "orange",
      solid: "contrast",
      solidStyle: "flat",
      border: "conservative",
      surface: "filled",
      transition: "all",
      scaling: "100",
    },
    display: {
      location: true,
      time: true,
      themeSwitcher: true,
      languageSwitcher: true,
    },
  },
  about: {
    intro: {
      display: true,
      title: {
        en: "About Me",
        zh: "自我介绍"
      },
      description: {
        en: "Write your self-introduction here.",
        zh: "在这里写你的自我介绍。"
      },
    },
    work: {
      display: false,
      title: {
        en: "Work Experience",
        zh: "工作经历"
      },
      experiences: [] as Array<{
        company: string;
        role: string;
        timeframe: string;
        achievements: string[];
      }>,
    },
    studies: {
      display: false,
      title: {
        en: "Education",
        zh: "学习经历"
      },
      institutions: [] as Array<{
        name: string;
        description: string;
      }>,
    },
    technical: {
      display: true,
      title: {
        en: "Interests",
        zh: "关注方向"
      },
      skills: [] as Array<{
        title: string;
        description: string;
        tags?: Array<{ name: string; icon: string }>;
      }>,
    },
    calendar: { display: false, link: "" },
  },
};

export default config;
