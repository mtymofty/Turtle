#! /usr/bin/bash
ts-node src/main.ts $1 && cd canvas && npm run build && cd build && xdg-open index.html