#!/bin/bash

set -e

VERSION=$(cat ./version.txt)
IMAGE_NAME="marcusthelin/slack-gitlab-unfurler"

echo "Building version $VERSION"

docker build -t "$IMAGE_NAME:$VERSION" -f Dockerfile.prod .
docker build -t "$IMAGE_NAME:latest" -f Dockerfile.prod .

echo "Build stage done!"

read -p "Press enter to start publish images..."

docker push "$IMAGE_NAME:$VERSION"
docker push "$IMAGE_NAME:latest"