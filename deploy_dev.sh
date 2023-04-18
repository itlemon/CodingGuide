#! /bin/bash
# author: itlemon

portArg=4000

# 通过ss的方式获取pid
function get_pid_by_listen_port() {
  local port="$1"
  lsof -t -i :"$port"
}

pid=$(get_pid_by_listen_port $portArg)
if [ -n "$pid" ]
then
        echo "find pid: $pid, kill it..."
        kill $pid
else
        echo 'cannot find listened port: '$portArg
fi

if git rev-parse --verify dev
then
     git checkout dev
else
     git checkout -b dev
fi

git fetch --all && git reset --hard origin/dev && git pull
yarn install
yarn docs:build
nohup yarn docs:serve &