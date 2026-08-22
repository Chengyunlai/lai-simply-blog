# Lai Simply Blog 渲染接口文档

## 概述

Lai Simply Blog 的渲染系统分为三层：

```
内容层（content/）  →  接口层（render/）  →  展示层（页面组件）
    Markdown 文件         类型 + 钩子           渲染输出
```

用户可以通过实现接口来自定义渲染行为，无需修改核心代码。

---

## 快速开始

### 最简用法（使用默认渲染器）

```tsx
// src/app/blog/page.tsx
import { getContent } from "@/utils/utils";
import { defaultRenderers } from "@/render";

export default function BlogPage() {
  const posts = getContent("posts");
  const { BlogListPage } = defaultRenderers;
  return <BlogListPage posts={posts} />;
}
```

### 自定义渲染器

```tsx
// src/render/custom.tsx
import type { BlogRenderers } from "@/render";

function MyMDXRenderer({ source }) {
  // 你的自定义 MDX 渲染逻辑
  return <div>{source}</div>;
}

function MyBlogListPage({ posts }) {
  // 你的自定义列表页
  return <ul>{posts.map(p => <li key={p.slug}>{p.title}</li>)}</ul>;
}

export const customRenderers: Partial<BlogRenderers> = {
  MDXRenderer: MyMDXRenderer,
  BlogListPage: MyBlogListPage,
};
```

```tsx
// src/app/blog/page.tsx
import { createRenderers } from "@/render";
import { customRenderers } from "@/render/custom";

const { BlogListPage } = createRenderers(customRenderers);
```

---

## 核心类型

### PostMeta（文章元数据）

```ts
interface PostMeta {
  title: string;          // 必填
  subtitle?: string;
  publishedAt: string;    // 必填，格式 YYYY-MM-DD
  summary: string;        // 必填
  image?: string;
  images?: string[];
  tag?: string;
  link?: string;
  [key: string]: unknown; // 允许扩展自定义字段
}
```

### Post（文章数据）

```ts
interface Post {
  slug: string;
  content: string;
  metadata: PostMeta;
  headings?: Heading[];
}
```

### Heading（标题条目）

```ts
interface Heading {
  level: 2 | 3;
  label: string;
  id: string;
}
```

### PostSummary（列表页摘要）

```ts
interface PostSummary {
  slug: string;
  title: string;
  summary: string;
  tag: string;
  publishedAt: string;
  displayDate: string;
  searchText: string;
}
```

---

## 可替换组件

### MDXRenderer

MDX 内容渲染器。

```tsx
interface MDXRendererProps {
  source: string;                              // 原始 markdown
  components?: Record<string, ComponentType>;  // 自定义组件映射
}

// 替换示例
const MyRenderer: MDXRendererComponent = ({ source, components }) => {
  return <MDXRemote source={source} components={components} />;
};
```

### BlogListPage

文章列表页。

```tsx
interface BlogListPageProps {
  posts: PostSummary[];
}
```

### BlogDetailPage

文章详情页。

```tsx
interface BlogDetailPageProps {
  post: Post;
  headings: Heading[];
  readingMinutes: number;
}
```

### ProjectListPage / ProjectDetailPage

项目列表和详情页，接口同上。

### HomePage

首页。

```tsx
interface HomePageProps {
  featuredPost?: Post;
  featuredHeadings?: string[];
}
```

---

## 内容钩子

### slugify

自定义标题转 URL slug 的方式。

```ts
hooks: {
  slugify: (text: string) => text.toLowerCase().replace(/\s+/g, "-"),
}
```

### formatDate

自定义日期格式化。

```ts
hooks: {
  formatDate: (date: string, relative?: boolean) => {
    return new Date(date).toLocaleDateString("zh-CN");
  },
}
```

### extractHeadings

自定义标题提取逻辑。

```ts
hooks: {
  extractHeadings: (markdown: string) => {
    // 返回 [{ level: 2, label: "标题", id: "标题" }]
  },
}
```

### parseFrontmatter

自定义 frontmatter 解析。

```ts
hooks: {
  parseFrontmatter: (data) => ({
    title: data.title as string,
    publishedAt: data.date as string,  // 用 date 代替 publishedAt
    summary: data.description as string,
    tag: data.category as string,
  }),
}
```

---

## 自定义 MDX 组件

不替换整个渲染器，只注入自定义组件：

```tsx
// src/render/components.tsx
function Callout({ type = "info", children }) {
  return <div className={`callout callout-${type}`}>{children}</div>;
}

function Image({ src, alt, caption }) {
  return (
    <figure>
      <img src={src} alt={alt} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = {
  Callout,
  Image,
};
```

```tsx
// 使用
import { resolveRenderConfig } from "@/render";
import { mdxComponents } from "@/render/components";

const config = resolveRenderConfig({ mdxComponents });
```

在 markdown 中使用：

```md
::Callout{type="warning"}
这是一个警告框。
::

::Image{src="/images/demo.png" alt="示例" caption="图 1"}
```

---

## 完整配置示例

```tsx
// src/render/config.ts
import { resolveRenderConfig } from "@/render";
import { mdxComponents } from "./components";

export const renderConfig = resolveRenderConfig({
  // 替换部分渲染器
  renderers: {
    MDXRenderer: MyMDXRenderer,
  },

  // 自定义钩子
  hooks: {
    formatDate: (date) => new Date(date).toLocaleDateString("zh-CN"),
  },

  // 注入自定义组件
  mdxComponents,
});
```

---

## 样式定制

渲染系统使用 CSS 变量驱动，覆盖变量即可定制样式：

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #2563eb;
  --max-width: 1200px;
  --content-width: 720px;
  --radius: 8px;
  --spacing: 1rem;
}

[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-text: #e5e5e5;
  --color-accent: #60a5fa;
}
```

完整 CSS 变量列表见 `src/resources/custom.css`。

---

## 目录结构

```
src/
├── render/                 # 渲染接口层
│   ├── types.ts            # 核心类型定义
│   ├── default-renderers.tsx # 默认渲染器实现
│   └── index.ts            # 入口：配置合并
├── utils/
│   ├── utils.ts            # 内容读取
│   ├── slugifyHeading.ts   # 标题 slug 生成
│   └── formatDate.ts       # 日期格式化
├── resources/
│   ├── custom.css          # 全局样式
│   └── content.tsx         # 站点配置
└── app/
    ├── blog/
    │   ├── page.tsx        # 列表页（使用渲染器）
    │   └── [slug]/page.tsx # 详情页（使用渲染器）
    └── work/
        ├── page.tsx
        └── [slug]/page.tsx
```

---

## 扩展 frontmatter

在 `PostMeta` 中添加自定义字段：

```yaml
---
title: "我的文章"
publishedAt: "2026-08-17"
summary: "摘要"
category: "技术"        # 自定义字段
difficulty: "intermediate"  # 自定义字段
---
```

```ts
// 类型扩展
declare module "@/render" {
  interface PostMeta {
    category?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
  }
}
```

在组件中使用：

```tsx
function BlogItem({ post }) {
  return (
    <article>
      <span>{post.metadata.category}</span>
      <span>{post.metadata.difficulty}</span>
      <h3>{post.metadata.title}</h3>
    </article>
  );
}
```
