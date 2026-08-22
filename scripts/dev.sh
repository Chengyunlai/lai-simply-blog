#!/bin/bash
# 清理旧进程和锁文件
cleanup() {
  local port=$1
  lsof -ti:$port | xargs kill -9 2>/dev/null
  rm -rf .next/dev/lock
}

# 查找可用端口
find_available_port() {
  local port=${1:-3001}
  while lsof -ti:$port >/dev/null 2>&1; do
    port=$((port + 1))
  done
  echo $port
}

# 清理 3000-3010 范围的端口
for p in $(seq 3000 3010); do
  lsof -ti:$p | xargs kill -9 2>/dev/null
done

# 清理锁文件
rm -rf .next/dev/lock

PORT=$(find_available_port ${1:-3001})
echo "Using port: $PORT"
exec npx next dev -p $PORT
