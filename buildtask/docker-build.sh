#!/usr/bin/env bash

npm install

npm run build

docker build --no-cache=true -f Dockerfile -t ${DOCKER_REPO}/web-ui:latest ./