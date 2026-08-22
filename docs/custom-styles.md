# 自定义样式指南

## CSS 类名一览

以下是博客系统使用的所有 CSS 类名，你可以在自定义 CSS 中覆盖它们。

### 布局

| 类名 | 说明 |
|------|------|
| `page-home` | 首页容器 |
| `page-blog` | 博客列表页容器 |
| `page-article` | 文章详情页容器 |
| `page-work` | 项目列表页容器 |
| `page-project` | 项目详情页容器 |
| `page-about` | 关于页容器 |
| `page-404` | 404 页容器 |

### 导航

| 类名 | 说明 |
|------|------|
| `header` | 顶部导航栏 |
| `header-inner` | 导航栏内部容器 |
| `header-left` | 左侧区域（位置信息） |
| `header-nav` | 中间导航链接区域 |
| `header-right` | 右侧区域（时间） |
| `header-link` | 导航链接 |
| `header-link.active` | 当前页导航链接 |
| `header-time` | 时间显示 |
| `footer` | 底部页脚 |
| `footer-inner` | 页脚内部容器 |
| `footer-copy` | 版权信息 |
| `footer-links` | 社交链接容器 |
| `footer-social` | 社交链接 |
| `footer-sep` | 分隔符 |
| `breadcrumb` | 面包屑导航 |

### 首页

| 类名 | 说明 |
|------|------|
| `hero` | 首页主视觉区域 |
| `hero-meta` | 元信息（年份、角色） |
| `hero-title` | 主标题 |
| `hero-desc` | 描述文字 |
| `hero-link` | CTA 按钮 |
| `section-label` | 区块标签（如"最新文章"） |
| `featured` | 精选文章区域 |
| `featured-card` | 精选文章卡片 |
| `featured-header` | 卡片头部（标签+链接） |
| `featured-tag` | 文章标签 |
| `featured-index` | 阅读索引列表 |

### 项目

| 类名 | 说明 |
|------|------|
| `projects-section` | 项目区块 |
| `projects-grid` | 项目网格 |
| `project-card` | 项目卡片 |
| `project-card-main` | 卡片主链接区域 |
| `project-card-link` | GitHub 链接 |

### 博客列表

| 类名 | 说明 |
|------|------|
| `blog-hero` | 博客页头部 |
| `blog-list` | 文章列表容器 |
| `blog-item` | 单篇文章条目 |
| `blog-item-header` | 条目头部（标签+日期） |
| `search-bar` | 搜索栏容器 |
| `search-input` | 搜索输入框 |
| `search-count` | 搜索结果数量 |
| `search-empty` | 无结果提示 |

### 文章详情

| 类名 | 说明 |
|------|------|
| `article-header` | 文章头部 |
| `article-meta` | 文章元信息（标签、日期、阅读时间） |
| `article-summary` | 文章摘要 |
| `article-cover` | 封面图 |
| `article-layout` | 文章布局（目录+正文） |
| `article-content` | Markdown 正文区域 |
| `article-footer` | 文章底部 |
| `related-projects` | 相关项目区域 |
| `toc` | 侧边目录 |

### 关于页

| 类名 | 说明 |
|------|------|
| `about-header` | 关于页头部 |
| `about-avatar` | 头像 |
| `about-social` | 社交链接 |
| `about-section` | 内容区块 |
| `skills-grid` | 技能网格 |
| `skill-card` | 技能卡片 |
| `skill-tags` | 标签容器 |

### 通用

| 类名 | 说明 |
|------|------|
| `theme-toggle` | 主题切换按钮 |

### Markdown 内部元素

以下类名由 MDX 渲染器自动应用，无需手动添加：

| 元素 | 说明 |
|------|------|
| `h1` - `h6` | 标题（自动添加 id） |
| `p` | 段落 |
| `a` | 链接（外部自动新窗口） |
| `code` | 行内代码 |
| `pre` | 代码块 |
| `blockquote` | 引用 |
| `ul` / `ol` | 列表 |
| `img` | 图片 |
| `hr` | 分隔线 |

---

## 自定义示例

### 1. 修改颜色主题

在 `content/blog.config.ts` 中修改，或在 `src/resources/custom.css` 中覆盖：

```css
/* 覆盖 CSS 变量 */
:root {
  --color-bg: #fafafa;
  --color-text: #333;
  --color-accent: #e11d48;           /* 改为红色 */
  --color-accent-hover: #be123c;
  --color-border: #e2e8f0;
  --color-bg-secondary: #f1f5f9;
}

[data-theme="dark"] {
  --color-bg: #18181b;
  --color-text: #fafafa;
  --color-accent: #fb7185;
  --color-accent-hover: #f43f5e;
}
```

### 2. 修改导航栏样式

```css
/* 透明背景 + 毛玻璃 */
.header {
  background: transparent;
  backdrop-filter: blur(12px);
  border-bottom: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 导航链接加下划线 */
.header-link {
  position: relative;
}

.header-link.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
}
```

### 3. 修改文章卡片样式

```css
/* 卡片悬浮效果 */
.blog-item {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.blog-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-accent);
}

/* 标签样式 */
.blog-item-header span:first-child {
  background: var(--color-accent);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}
```

### 4. 修改文章正文样式

```css
/* 更大的行高 */
.article-content {
  line-height: 2;
  font-size: 1.05rem;
}

/* 引用块样式 */
.article-content blockquote {
  border-left: 4px solid var(--color-accent);
  background: var(--color-bg-secondary);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
}

/* 代码块样式 */
.article-content pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.25rem;
  border-radius: 12px;
  border: none;
}

/* 图片居中 + 圆角 */
.article-content img {
  display: block;
  margin: 2rem auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 5. 修改目录样式

```css
/* 目录加背景 */
.toc {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

/* 活跃目录项高亮 */
.toc a:hover,
.toc a.active {
  color: var(--color-accent);
  font-weight: 500;
}
```

### 6. 修改搜索框样式

```css
/* 圆角搜索框 */
.search-input {
  border-radius: 999px;
  padding-left: 1.5rem;
  border: 2px solid var(--color-border);
}

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### 7. 添加自定义组件样式

如果你在 MDX 中使用了自定义组件：

```tsx
// src/render/components.tsx
function Callout({ type = "info", children }) {
  return <div className={`callout callout-${type}`}>{children}</div>;
}
```

```css
/* 对应的样式 */
.callout {
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid;
}

.callout-info {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1e40af;
}

.callout-warning {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #92400e;
}

.callout-error {
  background: #fef2f2;
  border-color: #ef4444;
  color: #991b1b;
}

[data-theme="dark"] .callout-info {
  background: #172554;
  color: #93c5fd;
}

[data-theme="dark"] .callout-warning {
  background: #451a03;
  color: #fcd34d;
}
```

---

## 完整自定义流程

1. **创建自定义 CSS 文件**

```css
/* content/custom.css */
:root {
  --color-accent: #8b5cf6;  /* 改为紫色 */
}

.blog-item:hover {
  border-color: var(--color-accent);
}
```

2. **在 layout.tsx 中引入**

```tsx
import "@/resources/custom.css";  // 系统默认
import "../../content/custom.css"; // 你的自定义（优先级更高）
```

3. **查看效果**

```bash
make dev
```

---

## 响应式断点

系统使用以下断点：

```css
/* 移动端 */
@media (max-width: 768px) {
  .article-layout {
    grid-template-columns: 1fr;  /* 目录隐藏 */
  }
  .toc {
    display: none;
  }
}

/* 你可以添加更多断点 */
@media (min-width: 1024px) {
  .blog-list {
    grid-template-columns: 1fr 1fr;  /* 两列 */
  }
}
```
