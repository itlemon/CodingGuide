#! /bin/bash
# author: itlemon

git pull
kill -9 $(ps aux | grep yarn | tr -s ' '| cut -d ' ' -f 2)
yarn install
yarn build
yarn serve &