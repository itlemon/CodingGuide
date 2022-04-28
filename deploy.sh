#! /bin/bash
# author: itlemon
[[ $# -lt 1 ]] && { echo 'param error: must have one param(port)'; exit -1; }
[[ $# -gt 1 ]] && { echo 'param error: only support one param(port)'; exit -1; }

function get_pid_by_listen_port() {
        pattern_str="*:$1\\b"
        pid=$(ss -n -t -l -p | grep "$pattern_str" | column -t | awk -F ',' '{print $(NF-1)}')

        # 当版本号为 "ss utility, iproute2-ss161009" 时, ss 命令输出格式为:
        #              LISTEN  0  5  *:8000  *:*  users:(("python2.7",pid=7130,fd=3))
        # 此时需要进一步处理, 只获取进程 PID 值.
        [[ $pid =~ "pid" ]] && pid=$(echo $pid | awk -F '=' '{print $NF}')

        echo $pid
}

port=4000
pid=$(get_pid_by_listen_port $port)
if [ -n "$pid" ]
then
        echo "find pid: $pid, kill it..."
        kill $pid
else
        echo 'cannot find listened port: '$port
        exit -1
fi

git pull
yarn install
yarn build
yarn serve &