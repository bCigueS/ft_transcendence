#!/bin/sh

docker container rm -f $(docker container ls -qa)
docker volume rm -f $(docker volume ls -q)
docker image rm -f $(docker image ls -qa)
docker system prune -af

rm -rf ./data/reactapp/*
rm -rf ./data/nestapp/*