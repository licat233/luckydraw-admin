#!/bin/bash

# 从URL获取文件名和文件路径
URL1="http://localhost:7878/api/static/luckydraw.ts"
URL2="http://localhost:7878/api/static/luckydrawComponents.ts"
URL3="http://localhost:7878/api/static/swagger.json"
# FILENAME1=$(basename1 "$URL1")
# FILENAME2=$(basename2 "$URL2")
# DIRECTORY="."

# 创建下载目录（如果不存在）
# mkdir -p "$DIRECTORY"

# 下载文件
wget -O basename1 "$URL1"
# 检查下载是否成功
if [ $? -ne 0 ]; then
    echo "文件下载失败，请检查URL是否正确。"
    exit 1
fi

wget -O basename2 "$URL2"
# wget "$URL1"
# wget "$URL2"

# 检查下载是否成功
if [ $? -eq 0 ]; then
    echo "文件已下载成功，正在更新本地文件..."
    echo "本地文件已更新完成。"
else
    echo "文件下载失败，请检查URL是否正确。"
fi

wget -O basename3 "$URL3"

# 检查下载是否成功
if [ $? -eq 0 ]; then
    echo "文件已下载成功，正在更新本地文件..."
    echo "本地文件已更新完成。"
else
    echo "文件下载失败，请检查URL是否正确。"
fi

rm -f luckydraw.ts
rm -f luckydrawComponents.ts
rm -f swagger.json

mv basename1 luckydraw.ts
mv basename2 luckydrawComponents.ts
mv basename3 swagger.json

echo "import { webapi } from './webapi';" | cat - luckydraw.ts > luckydraw.tmp && mv luckydraw.tmp luckydraw.ts