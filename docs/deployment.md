# 部署指南

## 私人服务器部署（推荐）

### 方式一：Node.js 直接运行

```bash
# 安装依赖
npm install

# 构建
npm run build

# 启动（默认端口 3001）
npm start

# 或使用 PM2 守护进程
pm2 start npm --name "lai-simply-blog" -- start
```

### 方式二：Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3001
CMD ["npm", "start"]
```

构建并运行：

```bash
docker build -t lai-simply-blog .
docker run -p 3001:3001 lai-simply-blog
```

### 方式三：Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Vercel 部署

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动部署，支持所有功能
4. 支持自定义域名

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | `3001` |

## 配置管理

### 开发模式

运行 `npm run dev` 后，访问 `/settings` 页面进行可视化配置。

配置保存在 `blog.config.json`，可直接 git commit 部署。

### 生产模式

直接编辑 `blog.config.json`，然后重新构建部署。

## 注意事项

- 本项目使用 next-intl 进行国际化，需要服务端支持
- 不支持纯静态导出（如 GitHub Pages）
- 推荐使用 Vercel 或私人服务器部署
