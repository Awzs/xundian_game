#!/bin/bash

echo "🚀 启动好奇星球游戏工坊..."
echo ""
echo "请选择启动方式："
echo "1. Python HTTP Server (需要Python)"
echo "2. Node.js HTTP Server (需要Node.js)"
echo "3. 直接打开文件"
echo ""

read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo "使用Python启动服务器..."
        python3 -m http.server 8000 2>/dev/null || python -m SimpleHTTPServer 8000
        ;;
    2)
        echo "使用Node.js启动服务器..."
        npx http-server -p 8000
        ;;
    3)
        echo "在浏览器中打开..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open index.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open index.html
        else
            start index.html
        fi
        ;;
    *)
        echo "无效选项"
        ;;
esac