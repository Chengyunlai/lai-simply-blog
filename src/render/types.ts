// src/render/types.ts
// 博客渲染核心类型定义
// 用户实现这些接口来自定义渲染行为

// ============================================================
// 1. 内容数据结构
// ============================================================

/** 文章元数据（从 frontmatter 解析） */
export interface PostMeta {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images?: string[];
  tag?: string;
  link?: string;
  [key: string]: unknown;  // 允许用户扩展自定义字段
}

/** 文章完整数据 */
export interface Post {
  slug: string;
  content: string;       // 原始 markdown 内容
  metadata: PostMeta;
  headings?: Heading[];  // 提取的标题目录
}

/** 标题条目 */
export interface Heading {
  level: 2 | 3;
  label: string;
  id: string;
}

/** 列表页文章摘要（用于搜索和展示） */
export interface PostSummary {
  slug: string;
  title: string;
  summary: string;
  tag: string;
  publishedAt: string;
  displayDate: string;
  searchText: string;
}

// ============================================================
// 2. MDX 渲染接口
// ============================================================

/** 自定义 MDX 组件映射 */
export type MDXComponents = Record<string, React.ComponentType<any>>;

/** MDX 渲染器 Props */
export interface MDXRendererProps {
  source: string;
  components?: MDXComponents;
}

/** MDX 渲染器组件类型 */
export type MDXRendererComponent = React.ComponentType<MDXRendererProps>;

// ============================================================
// 3. 页面组件接口
// ============================================================

/** 文章列表页 Props */
export interface BlogListPageProps {
  posts: PostSummary[];
}

/** 文章详情页 Props */
export interface BlogDetailPageProps {
  post: Post;
  headings: Heading[];
  readingMinutes: number;
}

/** 项目列表页 Props */
export interface ProjectListPageProps {
  projects: Post[];
}

/** 项目详情页 Props */
export interface ProjectDetailPageProps {
  post: Post;
}

/** 首页 Props */
export interface HomePageProps {
  featuredPost?: Post;
  featuredHeadings?: string[];
}

// ============================================================
// 4. 渲染器配置
// ============================================================

/** 用户可实现的渲染器 */
export interface BlogRenderers {
  /** MDX 渲染组件 */
  MDXRenderer: MDXRendererComponent;

  /** 文章列表页组件 */
  BlogListPage?: React.ComponentType<BlogListPageProps>;

  /** 文章详情页组件 */
  BlogDetailPage?: React.ComponentType<BlogDetailPageProps>;

  /** 项目列表页组件 */
  ProjectListPage?: React.ComponentType<ProjectListPageProps>;

  /** 项目详情页组件 */
  ProjectDetailPage?: React.ComponentType<ProjectDetailPageProps>;

  /** 首页组件 */
  HomePage?: React.ComponentType<HomePageProps>;
}

/** 内容处理钩子 */
export interface ContentHooks {
  /** 自定义 slug 生成 */
  slugify?: (text: string) => string;

  /** 自定义日期格式化 */
  formatDate?: (date: string, relative?: boolean) => string;

  /** 自定义 frontmatter 解析 */
  parseFrontmatter?: (data: Record<string, unknown>) => PostMeta;

  /** 自定义标题提取 */
  extractHeadings?: (markdown: string) => Heading[];
}

/** 完整渲染配置 */
export interface RenderConfig {
  /** 组件渲染器 */
  renderers?: Partial<BlogRenderers>;

  /** 内容处理钩子 */
  hooks?: ContentHooks;

  /** 自定义 MDX 组件（注入到默认渲染器） */
  mdxComponents?: MDXComponents;
}
