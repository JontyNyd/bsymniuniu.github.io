#!/usr/bin/env bash
# 从第三方站下载 CC0 美术与音效（需外网；失败时保留本地/生成版本）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/assets/images"
AUD="$ROOT/assets/audio"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

mkdir -p "$IMG" "$AUD"

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

echo "========== 美术 (OpenGameArt CC0) =========="
download "https://opengameart.org/sites/default/files/chineseroof2.png" \
  "$IMG/chinese-roof.png" || true
download "https://opengameart.org/sites/default/files/clouds.png" \
  "$IMG/cloud.png" || true
download "https://opengameart.org/sites/default/files/fog.png" \
  "$IMG/fog.png" || true
download "https://opengameart.org/sites/default/files/cloudy_mountains.png" \
  "$IMG/battle-scene-bg.png" || true
download "https://opengameart.org/sites/default/files/mountainsfardetail.png" \
  "$IMG/mountains-far.png" || true
download "https://opengameart.org/sites/default/files/back2.png" \
  "$IMG/title-bg.png" || true

echo ""
echo "========== 音效 (OpenGameArt CC0) =========="
download "https://opengameart.org/sites/default/files/fort_fairy.mp3" \
  "$AUD/bgm_battle.mp3" || true
download "https://opengameart.org/sites/default/files/deja_vus_1st_loop.mp3" \
  "$AUD/bgm_boss.mp3" || true
download "https://opengameart.org/sites/default/files/punch_2.wav" \
  "$AUD/enemy_hit.wav" || true
download "https://opengameart.org/sites/default/files/punch_6.wav" \
  "$AUD/enemy_hit_heavy.wav" || true

echo ""
echo "========== 压缩与本地生成 =========="
if command -v python3 >/dev/null 2>&1; then
  python3 "$ROOT/scripts/optimize-art.py" 2>/dev/null || true
  python3 "$ROOT/scripts/generate-art.py" 2>/dev/null || true
else
  echo "未找到 python3，跳过压缩"
fi

# 删除体积过大的原始 PNG（保留 JPG 版本）
rm -f "$IMG/battle-scene-bg.png" "$IMG/mountains-far.png" 2>/dev/null || true

echo ""
echo "完成。运行 ./serve.sh 试玩。"
