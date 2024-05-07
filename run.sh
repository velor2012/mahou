#!/bin/bash

# 设置自定义的退出状态
CUSTOM_EXIT_STATUS=0

# 运行命令并获取其退出状态
timeout --preserve-status 10s pnpm start
exit_status=$?

# 检查是否由于超时而退出
if [ $exit_status -eq 124 ]; then
  # 手动设置退出状态为我们的自定义值
  exit $CUSTOM_EXIT_STATUS
else
  # 保持原来的退出状态
  exit $exit_status
fi