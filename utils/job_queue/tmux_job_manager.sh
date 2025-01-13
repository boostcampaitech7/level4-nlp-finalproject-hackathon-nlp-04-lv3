#!/bin/bash

# 재접속 시
# tmux attach-session -t job_manager
SESSION_NAME="job_manager"

# 패키지 설치 함수
install_package() {
    local package_name=$1
    if ! command -v $package_name &> /dev/null; then
        echo "$package_name이 설치되어 있지 않습니다. 설치를 시작합니다..."
        apt-get update
        apt-get install -y $package_name
        if [ $? -ne 0 ]; then
            echo "$package_name 설치에 실패했습니다. 시스템 관리자에게 문의하세요."
            exit 1
        fi
        echo "$package_name 설치가 완료되었습니다."
    fi
}

# 필요한 의존성 설치
echo "필요한 의존성을 확인하고 설치합니다..."
install_package tmux

# 현재 스크립트의 디렉토리 경로 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# .env 파일 로드
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo ".env 파일을 찾을 수 없습니다: $ENV_FILE"
    echo "새로운 .env 파일을 생성합니다."

    # 사용자로부터 ROOT_DIR 입력받기 (기본값: 현재 프로젝트 디렉토리)
    read -p "프로젝트 루트 디렉토리 경로를 입력하세요 [기본값: $PROJECT_ROOT]: " ROOT_DIR
    ROOT_DIR=${ROOT_DIR:-$PROJECT_ROOT}

    # .env 파일 생성
    cat > "$ENV_FILE" << EOL
ROOT_DIR="${ROOT_DIR}"
EOL

    echo ".env 파일이 성공적으로 생성되었습니다: $ENV_FILE"
    source "$ENV_FILE"
fi

# ROOT_DIR 기반으로 경로 설정
QUEUE_FILE="$ROOT_DIR/job_queue.txt"
ENQUEUE_SCRIPT="$ROOT_DIR/utils/enqueue.sh"
WORKER_LOG="$ROOT_DIR/job_worker.log"

# 사용자의 환경 변수와 PATH 설정 로드
source ~/.bashrc

# 파일이 없으면 생성
if [ ! -f "$QUEUE_FILE" ]; then
    echo "Initializing job queue..." > "$QUEUE_FILE"
fi

if [ ! -f "$WORKER_LOG" ]; then
    echo "Initializing worker log..." > "$WORKER_LOG"
fi

# tmux 세션이 이미 존재하는지 확인
tmux has-session -t "$SESSION_NAME" 2>/dev/null

if [ $? != 0 ]; then
    # 새 tmux 세션 생성 (detached 상태)
    tmux new-session -d -s "$SESSION_NAME" -n "Main" "watch -n 1 cat $QUEUE_FILE"
    # tmux 세션에서 마우스 모드 활성화
    tmux set-option -t "$SESSION_NAME" -g mouse on
    # 화살표 키 히스토리 설정
    tmux set-option -t "$SESSION_NAME" -g history-limit 10000
    tmux set-window-option -t "$SESSION_NAME" -g mode-keys vi

    # 창을 수직으로 분할하여 하단에 새로운 패널 생성 (Pane 1)
    tmux split-window -h -t "${SESSION_NAME}:Main" -p 50
    tmux split-window -h -t "${SESSION_NAME}:Main.1" -p 50

    # 하단 패널을 다시 수평으로 분할하여 Pane 1과 Pane 2 생성

    # Pane 1에 enqueue.sh 스크립트 실행
    tmux send-keys -t "${SESSION_NAME}:Main.1" "$ENQUEUE_SCRIPT" C-m

    # Pane 2에 worker.log 모니터링 명령어 실행
    tmux send-keys -t "${SESSION_NAME}:Main.2" "tail -F $WORKER_LOG" C-m

    # 원하는 레이아웃으로 설정 (main-vertical은 상단 패널과 하단 패널을 수평으로 배치)
    tmux select-layout -t "$SESSION_NAME":Main main-horizontal
    tmux resize-pane -t "${SESSION_NAME}:Main.0" -y 5
fi

# tmux 세션에 연결
tmux attach-session -t "$SESSION_NAME"
