#! /bin/bash
# author: itlemon

port=4000

function get_pid_by_listen_port() {
        pattern_str="*:$port\\b"
        pid=$(ss -n -t -l -p | grep "$pattern_str" | column -t | awk -F ',' '{print $(NF-1)}')

        # 当版本号为 "ss utility, iproute2-ss161009" 时, ss 命令输出格式为:
        #              LISTEN  0  5  *:8000  *:*  users:(("python2.7",pid=7130,fd=3))
        # 此时需要进一步处理, 只获取进程 PID 值.
        [[ $pid =~ "pid" ]] && pid=$(echo $pid | awk -F '=' '{print $NF}')

        echo $pid
}

pid=$(get_pid_by_listen_port $port)
if [ -n "$pid" ]
then
        echo "find pid: $pid, kill it..."
        kill $pid
else
        echo 'cannot find listened port: '$port
fi

if git rev-parse --verify master
then
     git checkout master
else
     git checkout -b master
fi

git fetch --all && git reset --hard origin/master && git pull
sudo npm install
sudo nohup npm run docs:dev &