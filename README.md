# Lai Simply Blog

> 一个简洁的个人博客系统，基于 Next.js 16 构建。

[English](./README_EN.md)

## 预览

| 首页 | 博客列表 |
|:---:|:---:|
| ![首页](docs/images/home-en.png) | ![博客列表](docs/images/blog-en.png) |

| 文章详情 | 设置页面 |
|:---:|:---:|
| ![文章详情](docs/images/article-en.png) | ![设置页面](docs/images/settings-en.png) |

## 特性

- 中英文路由支持，内容可按需维护单语言或双语版本
- 亮色/暗色主题切换
- 4 种文章渲染风格（Default / GitHub / Notion / Academic）
- 可视化配置页面（开发模式）
- 代码语法高亮（Prism.js）
- 响应式设计
- Markdown 内容编写
- 支持 GitHub Pages / 私人服务器 / Vercel / Docker 部署

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/Chengyunlai/lai-simply-blog.git
cd lai-simply-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3001 查看博客。

首页采用类似 GitHub 个人主页的布局：左侧为吸顶的个人介绍栏，右侧为内容列表。首页最多显示 10 篇最近文章和 5 个项目，超出部分可从“查看全部”入口进入博客页或项目页。独立的 About 页面已移除，个人介绍统一维护在首页。

## 配置站点

### 方式一：可视化配置（推荐）

1. 启动开发服务器 `npm run dev`
2. 点击导航栏右侧的齿轮图标 ⚙️
3. 在设置页面修改配置
4. 点击保存

### 方式二：手动编辑

编辑根目录的 `blog.config.json`：

```json
{
  "site": {
    "title": {
      "en": "My Blog",
      "zh": "我的博客"
    },
    "baseURL": "https://your-domain.com"
  },
  "person": {
    "name": "Your Name",
    "role": {
      "en": "Developer",
      "zh": "开发者"
    }
  }
}
```

## 写作

在 `content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
summary: "文章摘要"
tag: "分类"
publishedAt: "2025-01-20"
---

正文内容...
```

Frontmatter 字段：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `summary` | 否 | 文章摘要 |
| `tag` | 否 | 分类标签 |
| `publishedAt` | 是 | 发布日期（YYYY-MM-DD） |

博客列表页直接显示搜索和文章列表，不再额外显示宣传标题区。

## 部署

### 私人服务器

```bash
npm run build
npm start
```

默认监听 3001 端口。

### Docker

```bash
docker build -t lai-simply-blog .
docker run -d -p 3001:3001 --name blog lai-simply-blog
```

### GitHub Pages

1. Fork 本仓库
2. 在 Settings → Pages 中启用 GitHub Actions
3. 推送代码后自动部署

> GitHub Pages 部署时需在 `blog.config.json` 中设置 `site.basePath` 为仓库名（如 `/lai-simply-blog`）。

### Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动部署

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 | 框架（App Router, Turbopack） |
| React 19 | UI 渲染 |
| TypeScript | 类型安全 |
| next-intl | 国际化 |
| Prism.js | 代码高亮 |
| remark-gfm | Markdown 增强（表格、任务列表） |

## 目录结构

```
lai-simply-blog/
├── blog.config.json          # 站点配置（主配置文件）
├── content/
│   ├── posts/                # 博客文章（.md）
│   └── projects/             # 项目展示（按数字目录排序）
├── src/
│   ├── app/                  # 页面路由
│   │   └── [locale]/         # 国际化路由
│   ├── components/           # React 组件
│   ├── i18n/                 # 国际化配置
│   ├── messages/             # 翻译文件（en.json, zh.json）
│   ├── resources/            # 样式、配置、主题
│   │   ├── themes/           # 文章渲染主题
│   │   └── custom.css        # 全局样式
│   └── lib/                  # 工具函数
├── public/
│   └── images/               # 静态资源
└── docs/                     # 文档
```

### 项目内容

项目按数字目录排列，数字越小越靠前。每个项目目录至少包含 `meta.json`，可以按需要添加 `detail.md`：

```
content/projects/
├── 1/
│   ├── meta.json
│   └── detail.md       # 可选，使用博客相同的 Markdown 渲染
├── 2/
│   └── meta.json
└── 3/
    └── meta.json
```

`meta.json` 支持以下字段：

```json
{
  "name": "项目名称",
  "description": "项目简介",
  "category": "分类",
  "link": "https://example.com",
  "image": "/images/project-cover.png"
}
```

其中 `category`、`link` 和 `image` 均为可选字段，`image` 支持本地路径和 `https://...` 远程地址。当项目存在至少两种分类时，项目页会显示分类标签和分类分割线。

`name`、`description` 和 `category` 可以直接写字符串，也可以写成 `{ "en": "...", "zh": "..." }`。双语对象不要求同时维护两种语言，缺少一侧时会自动使用另一侧作为回退。图片使用本地路径时，请将文件放在 `public/` 下（例如 `public/images/project-cover.png`），然后在元数据中填写以 `/` 开头的 URL。

仓库内置了三个示例项目，启动开发服务器后可访问：<http://localhost:3001/en/work>（中文页面：<http://localhost:3001/zh/work>）。

项目卡片整体是正方形；如果提供 `image`，图片区域按 2:1 横向比例展示。建议准备 `1200×600px`（最低 `800×400px`）的图片，主体尽量居中，重要内容不要贴近边缘，页面会自动裁剪适配。

## 自定义主题

文章支持 4 种渲染风格，在设置页面或 `blog.config.json` 中切换：

| 主题 | 风格说明 |
|------|----------|
| `default` | 默认简洁风格 |
| `github` | GitHub 风格 |
| `notion` | Notion 风格 |
| `academic` | 学术论文风格 |

## License

MIT
