# Lai Simply Blog - 个人博客系统
# ================================

.PHONY: dev build start clean lint typecheck check create-post docker-build docker-run docker-stop deploy help

# 默认端口
PORT ?= 3001
# Docker 镜像名
IMAGE_NAME ?= lai-simply-blog
# Docker 容器名
CONTAINER_NAME ?= lai-simply-blog

help: ## 显示帮助
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ==================== 开发 ====================

install: ## 安装依赖
	npm install

dev: ## 启动开发服务器
	@bash scripts/dev.sh

# ==================== 构建 ====================

build: ## 构建生产版本
	npm run build

build-github: ## 构建 GitHub Pages 版本
	npm run build:github

# ==================== 运行 ====================

start: ## 启动生产服务器
	npm run start

# ==================== 清理 ====================

clean: ## 清理构建产物
	rm -rf .next out

clean-all: ## 清理所有（包括 node_modules）
	rm -rf .next out node_modules

# ==================== 检查 ====================

lint: ## 运行 linter
	npm run format

typecheck: ## 类型检查
	npm run lint

check: typecheck ## 运行所有检查

# ==================== 文章 ====================

create-post: ## 创建新文章 (用法: make create-post TITLE="标题" TAG="标签")
	@bash scripts/create-post.sh "$(TITLE)" "$(TAG)"

# ==================== Docker ====================

docker-build: ## 构建 Docker 镜像
	docker build -t $(IMAGE_NAME) .

docker-run: ## 运行 Docker 容器
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):3001 $(IMAGE_NAME)

docker-stop: ## 停止 Docker 容器
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

docker-logs: ## 查看 Docker 日志
	docker logs -f $(CONTAINER_NAME)

docker-restart: docker-stop docker-run ## 重启 Docker 容器

# ==================== 部署 ====================

deploy: build start ## 构建并启动（本地部署）

deploy-docker: docker-build docker-run ## 构建并运行 Docker

deploy-github: build-github ## 构建 GitHub Pages 版本
	@echo "构建完成！上传 out/ 目录到 GitHub Pages"

# ==================== PM2 ====================

pm2-start: ## 使用 PM2 启动
	pm2 start npm --name "$(CONTAINER_NAME)" -- start

pm2-stop: ## 停止 PM2 进程
	pm2 stop $(CONTAINER_NAME)

pm2-restart: ## 重启 PM2 进程
	pm2 restart $(CONTAINER_NAME)

pm2-logs: ## 查看 PM2 日志
	pm2 logs $(CONTAINER_NAME)
