#!/usr/bin/env bash
# 可选：从第三方站下载 CC0 素材（需可访问外网；失败时保留本地生成图）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/assets/images"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

mkdir -p "$IMG"

download() {
  local url="$1"
  local out="$2"
  echo "→ $url"
  if curl -fsSL -A "$UA" -o "$out.tmp" "$url"; then
    mv "$out.tmp" "$out"
    echo "  ✓ $(basename "$out") ($(wc -c < "$out") bytes)"
    return 0
  fi
  rm -f "$out.tmp"
  echo "  ✗ 下载失败，保留现有文件"
  return 1
}

ok=0
download "https://opengameart.org/sites/default/files/chineseroof2.png" \
  "$IMG/chinese-roof.png" && ok=$((ok+1)) || true

download "https://openclipart.org/image/800px/svg_to_png/289725" \
  "$IMG/chinese-roof-alt.png" || true

if [[ "$ok" -eq 0 ]]; then
  echo ""
  echo "外网素材未拉取成功，正在用本地脚本生成高清替代图…"
  python3 "$ROOT/scripts/generate-art.py"
else
  echo ""
  echo "已更新屋檐图。祥云/羊皮纸仍使用 scripts/generate-art.py 生成版本。"
  python3 "$ROOT/scripts/generate-art.py"
fi

echo "完成。运行 ./serve.sh 试玩。"
