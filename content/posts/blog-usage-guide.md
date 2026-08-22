---
title: "Lai Simply Blog 使用指南"
summary: "如何配置、写作和部署你的 Lai Simply Blog 个人博客"
tag: "指南"
publishedAt: "2025-01-20"
---

## 快速开始

Lai Simply Blog 是一个基于 Next.js 的个人博客系统，支持中英文、亮暗主题、静态部署。

### 安装

```bash
git clone https://github.com/your-username/lai-simply-blog.git
cd lai-simply-blog
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001 即可看到博客。

## 配置站点

### 方式一：可视化配置（推荐）

1. 启动开发服务器 `npm run dev`
2. 点击导航栏右侧的齿轮图标 ⚙️
3. 在设置页面修改配置
4. 点击保存，页面自动刷新

### 方式二：手动编辑

编辑根目录的 `blog.config.json`：

```json
{
  "site": {
    "title": {
      "en": "My Blog",
      "zh": "我的博客"
    },
    "description": {
      "en": "A personal blog",
      "zh": "个人博客"
    }
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

### 创建文章

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

### Frontmatter 字段

| 字段 | 说明 | 必填 |
|------|------|------|
| title | 文章标题 | ✓ |
| summary | 文章摘要 | ✓ |
| tag | 分类标签 | ✗ |
| publishedAt | 发布日期 | ✓ |

### Markdown 语法

支持标准 Markdown 语法和 GFM 扩展：

- **标题** - `# H1`, `## H2`, `### H3`
- **列表** - `- 无序列表`, `1. 有序列表`
- **代码** - 行内代码 `` `code` ``，代码块 ``` ``` ```
- **链接** - `[文字](url)`
- **图片** - `![alt](url)`
- **引用** - `> 引用内容`
- **表格** - GFM 表格语法
- **任务列表** - `- [x] 已完成`

## 导航配置

在 `blog.config.json` 的 `navigation.routes` 中控制页面显示：

```json
{
  "navigation": {
    "routes": {
      "/": true,
      "/about": true,
      "/work": false,
      "/blog": true
    }
  }
}
```

- `true` - 显示该页面
- `false` - 隐藏该页面

## 主题切换

- 点击导航栏的 🌙/☀️ 图标切换亮暗主题
- 主题会保存在浏览器本地存储中

## 语言切换

- 点击导航栏的 中/EN 按钮切换中英文
- 支持中英文独立内容

## 部署

### GitHub Pages（免费）

1. 推送代码到 GitHub
2. 在仓库 Settings > Pages 中选择 "GitHub Actions"
3. 推送到 main 分支自动部署

### Vercel（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动部署，支持自定义域名

### 私人服务器

```bash
# 构建
npm run build

# 启动
npm start

# 或使用 PM2
pm2 start npm --name "lai-simply-blog" -- start
```

## 目录结构

```
lai-simply-blog/
├── blog.config.json      # 站点配置
├── content/
│   ├── posts/            # 博客文章
│   └── projects/         # 项目展示
├── src/
│   ├── app/              # 页面路由
│   ├── components/       # 组件
│   ├── messages/         # 国际化翻译
│   └── resources/        # 样式和配置
└── public/
    └── images/           # 图片资源
```

## 常见问题

### Q: 如何添加新页面？

1. 在 `src/app/[locale]/` 下创建目录和 `page.tsx`
2. 在 `blog.config.json` 的 `navigation.routes` 中添加路由

### Q: 如何自定义样式？

编辑 `src/resources/custom.css`，使用 CSS 变量：

```css
:root {
  --color-accent: #2563eb;  /* 主题色 */
  --radius: 8px;            /* 圆角 */
}
```

### Q: 文章支持多语言吗？

当前版本支持单语言文章。如需多语言，可以创建多个文件：
- `post-en.md`
- `post-zh.md`

### Q: 如何自定义文章渲染方式？

工程支持自定义 MDX 渲染组件。在 `src/components/mdx.tsx` 中可以：

**1. 自定义标题组件**

```tsx
function createHeading(level: number) {
  return function Heading({ children, ...props }) {
    return <h{level} className="custom-heading" {...props}>
      <a href={`#${children}`}>{children}</a>
    </h{level}>;
  };
}
```

**2. 自定义代码块**

```tsx
const components = {
  pre: ({ children }) => (
    <div className="code-block">
      <CopyButton />
      <pre>{children}</pre>
    </div>
  ),
};
```

**3. 添加自定义组件**

```tsx
const components = {
  Callout: ({ children, type }) => (
    <div className={`callout callout-${type}`}>
      {children}
    </div>
  ),
};
```

然后在 Markdown 中使用：

```mdx
<Callout type="info">
  这是一个提示框
</Callout>
```

**4. 修改链接行为**

```tsx
const components = {
  a: ({ href, children }) => {
    if (href.startsWith("http")) {
      return <a href={href} target="_blank" rel="noopener noreferrer">
        {children} ↗
      </a>;
    }
    return <a href={href}>{children}</a>;
  },
};
```

## 反馈

如有问题或建议，欢迎提交 Issue：

- GitHub: https://github.com/Chengyunlai/lai-simply-blog

---

祝你写作愉快！ 🎉
