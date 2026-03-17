#!/bin/bash
set -euo pipefail

clang++ -std=c++17 \
  src/main.cpp \
  -I"$(brew --prefix crow)/include" \
  -I"$(brew --prefix asio)/include" \
  -o app

echo "Built ./app"
echo "Run with: ./app"
