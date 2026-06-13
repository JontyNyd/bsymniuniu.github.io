#!/usr/bin/env bash
# 《榜上有名》一键本地服务器 — 解决 file:// 无法加载音效/图片的问题
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
PORT="${PORT:-8080}"

echo "======================================"
echo "  榜上有名 — 本地试玩服务器"
echo "======================================"
echo "目录: $ROOT"
echo "地址: http://127.0.0.1:${PORT}"
echo "按 Ctrl+C 停止"
echo ""

if ! command -v python3 >/dev/null 2>&1; then
  echo "错误: 未找到 python3，请先安装 Python 3。" >&2
  exit 1
fi

if command -v open >/dev/null 2>&1; then
  (sleep 0.8 && open "http://127.0.0.1:${PORT}") &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 0.8 && xdg-open "http://127.0.0.1:${PORT}") &
fi

exec python3 -m http.server "$PORT" --bind 127.0.0.1
