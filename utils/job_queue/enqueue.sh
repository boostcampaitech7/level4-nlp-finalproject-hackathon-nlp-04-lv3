#!/bin/bash

# 현재 스크립트의 디렉토리 경로 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# .env 파일 로드
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo ".env 파일을 찾을 수 없습니다: $ENV_FILE"
    exit 1
fi

QUEUE_FILE="$ROOT_DIR/job_queue.txt"
LAST_PID_FILE="$ROOT_DIR/last_job.pid"
HISTFILE="$ROOT_DIR/.enqueue_history"

# readline 설정
set -o emacs
bind '"\e[A": history-search-backward'
bind '"\e[B": history-search-forward'

# 히스토리 설정
HISTSIZE=1000
HISTFILESIZE=2000

# 히스토리 파일이 없으면 생성
touch "$HISTFILE"
# 히스토리 파일 로드
history -r "$HISTFILE"

clear
while true; do
    echo "추가할 작업 명령어를 입력하세요 (종료하려면 'exit' 입력, 마지막 작업 취소는 'ccc' 입력):"
    read -e JOB_CMD
    history -s "$JOB_CMD"
    history -w "$HISTFILE"

    if [ "$JOB_CMD" == "exit" ]; then
        echo "작업 추가를 종료합니다."
        break
    elif [ "$JOB_CMD" == "ccc" ]; then
        if [ -f "$LAST_PID_FILE" ]; then
            LAST_PID=$(cat "$LAST_PID_FILE")
            if kill -0 "$LAST_PID" 2>/dev/null; then
                # 프로세스 그룹 전체 종료
                pkill -TERM -P "$LAST_PID"
                kill -TERM -"$LAST_PID" 2>/dev/null
                sleep 1
                # 여전히 실행 중이면 강제 종료
                if kill -0 "$LAST_PID" 2>/dev/null; then
                    pkill -KILL -P "$LAST_PID"
                    kill -KILL -"$LAST_PID" 2>/dev/null
                fi
                echo "마지막 작업(PID: $LAST_PID)이 종료되었습니다."
            else
                echo "마지막 작업이 이미 종료되었습니다."
            fi
        else
            echo "실행 중인 작업이 없습니다."
        fi
    elif [ -n "$JOB_CMD" ]; then
        echo "$JOB_CMD" >> "$QUEUE_FILE"
        echo "작업이 job_queue.txt에 추가되었습니다: $JOB_CMD"
    else
        echo "명령어가 비어있습니다. 다시 입력해 주세요."
    fi
done
