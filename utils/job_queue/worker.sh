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

# ROOT_DIR 기반으로 경로 설정
QUEUE_FILE="$ROOT_DIR/job_queue.txt"
LOG_FILE="$ROOT_DIR/job_worker.log"
LAST_PID_FILE="$ROOT_DIR/last_job.pid"

source ~/.bashrc

# nohup을 사용하여 백그라운드에서 실행
exec 1>> "$LOG_FILE" 2>&1

while true; do
    if [ -s "$QUEUE_FILE" ]; then
        # 첫 번째 줄 읽기
        JOB=$(head -n 1 "$QUEUE_FILE")

        # 현재 시간 기록
        TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
        # 유효한 명령어인지 확인
        if [[ ! "$JOB" =~ ^[a-zA-Z0-9_./-]+ ]]; then
            echo "[$TIMESTAMP] 잘못된 명령어: $JOB"
            # 잘못된 명령어 제거
            sed -i '1d' "$QUEUE_FILE"
            continue
        fi
        # 명령어 실행 및 로그 기록
        echo "[$TIMESTAMP] 실행 중: $JOB"

        # 새로운 프로세스 그룹으로 실행
        (setsid bash -c "$JOB") 2>&1 &
        CURRENT_PID=$!
        echo "$CURRENT_PID" > "$LAST_PID_FILE"

        wait $CURRENT_PID
        EXIT_STATUS=$?

        if [ $EXIT_STATUS -eq 143 ] || [ $EXIT_STATUS -eq 137 ]; then
            # 작업이 시그널에 의해 종료된 경우 (SIGTERM=143 or SIGKILL=137)
            echo "[$TIMESTAMP] 작업이 취소되었습니다: $JOB"
        elif [ $EXIT_STATUS -eq 0 ]; then
            # 작업이 성공적으로 완료된 경우
            echo "[$TIMESTAMP] 완료: $JOB"
        else
            # 작업에 에러가 발생한 경우
            echo "[$TIMESTAMP] 에러 발생: $JOB"
        fi

        # 첫 번째 줄 삭제
        sed -i '1d' "$QUEUE_FILE"
    fi
    # 짧은 대기 후 다시 확인
    sleep 2
done
