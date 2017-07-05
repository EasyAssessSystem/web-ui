#!/usr/bin/env bash

TARGET_SERVER="59.110.152.96"
ENV_VARS="[]"
DOCKER_IMAGE="registry-vpc.cn-beijing.aliyuncs.com/easyassess/web-ui"
HOST_CONFIG="{\"PortBindings\":{\"80/tcp\": [{ \"HostPort\": \"80\"}]}}"
CONTAINER_CONFIG="{\"Name\": \"track-service\",\"Image\": \"$DOCKER_IMAGE\", \"Env\":$ENV_VARS, \"ExposedPorts\": {\"80/tcp\": {}}, \"HostConfig\": $HOST_CONFIG}"
#pull image
curl -v -X POST "http://$TARGET_SERVER:2376/images/create?fromImage=$DOCKER_IMAGE"
curl -v -H "Content-type: application/json" -X DELETE "http://$TARGET_SERVER:2376/containers/web-ui?force=true"
curl -v -H "Content-type: application/json" -X POST -d "$CONTAINER_CONFIG" "http://$TARGET_SERVER:2376/containers/create?name=web-ui"
curl -v -H "Content-type: application/json" -X POST "http://$TARGET_SERVER:2376/containers/web-ui/start"