#!/bin/bash
# macOS 双击启动：在终端中运行本地服务器并打开浏览器
cd "$(dirname "$0")"
chmod +x serve.sh 2>/dev/null || true
osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "cd '$PWD' && ./serve.sh"
end tell
APPLESCRIPT
