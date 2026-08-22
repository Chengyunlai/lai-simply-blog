#!/bin/bash
# 创建新文章脚本
# 用法: ./scripts/create-post.sh "标题" "标签"

TITLE="${1:-未命名文章}"
TAG="${2:-工程笔记}"
DATE=$(date +%Y-%m-%d)
SLUG=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9\u4e00-\u9fa5]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | tr '[:upper:]' '[:lower:]')

# 如果slug为空，使用日期
if [ -z "$SLUG" ]; then
  SLUG="post-$DATE"
fi

FILEPATH="content/posts/$SLUG.md"

# 检查文件是否已存在
if [ -f "$FILEPATH" ]; then
  echo "错误: 文件已存在 $FILEPATH"
  exit 1
fi

# 创建文章文件
cat > "$FILEPATH" << EOF
---
title: "$TITLE"
publishedAt: "$DATE"
summary: "在这里写一句话摘要。"
tag: "$TAG"
image: ""
---

## 第一节

在这里开始写作。

## 第二节

继续你的内容。
EOF

echo "✓ 已创建文章: $FILEPATH"
echo "  标题: $TITLE"
echo "  标签: $TAG"
echo "  日期: $DATE"
