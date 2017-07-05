#!/usr/bin/env bash

npm install

npm run build

docker build --no-cache=true -f Dockerfile -t registry.cn-beijing.aliyuncs.com/easyassess/web-ui:latest ./