#!/usr/bin/env bash
# 《榜上有名》自动化测试
set -euo pipefail
cd "$(dirname "$0")"
echo "运行游戏自动化测试…"
node --test tests/game.test.mjs
echo "全部测试通过 ✓"
