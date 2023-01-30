#!/usr/bin/env bash
docker login -u ${DOCKER_REPO_USER} -p ${DOCKER_REPO_PWD}
docker tag ${DOCKER_REPO}/web-ui ${DOCKER_REPO}/web-ui:latest
docker push ${DOCKER_REPO}/web-ui:latest
