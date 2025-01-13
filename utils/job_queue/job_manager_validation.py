import argparse
import time
import signal
import sys
import os
from datetime import datetime


def signal_handler(signum, frame):
    print(f"\n[{datetime.now()}] 프로세스가 시그널 {signum}을 받아 종료됩니다.")
    # 진행 상황 파일에 종료 메시지 기록
    with open("job_progress.txt", "a") as f:
        f.write(f"[{datetime.now()}] 프로세스가 시그널 {signum}을 받아 종료됩니다.\n")
    sys.exit(0)


def main():
    parser = argparse.ArgumentParser(
        description="Job Manager 테스트를 위한 긴 작업 시뮬레이션"
    )
    parser.add_argument("--job-id", type=str, required=True, help="작업 식별자")
    parser.add_argument("--duration", type=int, default=300, help="전체 작업 시간(초)")
    parser.add_argument(
        "--interval", type=int, default=5, help="진행 상황 업데이트 간격(초)"
    )
    args = parser.parse_args()

    # 시그널 핸들러 등록
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)

    print(f"[{datetime.now()}] 작업 {args.job_id} 시작 (PID: {os.getpid()})")

    # 진행 상황을 파일에 기록
    with open("job_progress.txt", "a") as f:
        f.write(f"[{datetime.now()}] 작업 {args.job_id} 시작 (PID: {os.getpid()})\n")

    try:
        for i in range(0, args.duration, args.interval):
            current_time = datetime.now()
            progress = (i / args.duration) * 100
            status = f"[{current_time}] 작업 {args.job_id}: {progress:.1f}% 완료"

            print(status)
            # 진행 상황을 파일에 기록
            with open("job_progress.txt", "a") as f:
                f.write(status + "\n")

            time.sleep(args.interval)

        # 작업 완료
        completion_msg = f"[{datetime.now()}] 작업 {args.job_id} 완료"
        print(completion_msg)
        with open("job_progress.txt", "a") as f:
            f.write(completion_msg + "\n")

    except Exception as e:
        error_msg = f"[{datetime.now()}] 작업 {args.job_id} 에러 발생: {str(e)}"
        print(error_msg)
        with open("job_progress.txt", "a") as f:
            f.write(error_msg + "\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
