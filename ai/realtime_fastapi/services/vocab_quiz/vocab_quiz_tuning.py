import os
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


class CreateTaskExecutor:
    def __init__(self):
        self._host = "https://clovastudio.stream.ntruss.com"
        self._uri = "/tuning/v2/tasks"
        self._status_uri = "/tuning/v2/tasks/{task_id}"  # 상태 확인을 위한 URI 추가
        self._api_key = os.getenv("NAVER_API_KEY")

        # 필수 필드들을 포함한 기본 요청 데이터 설정
        self.request_data = {
            "model": "HCX-003",  # 필수: 튜닝에 사용할 모델
            "tuningType": "PEFT",  # 필수: 튜닝 유형
            "taskType": "GENERATION",  # 선택: 작업 유형 (기본값)
            "trainingDatasetBucket": os.getenv("BUCKET_NAME"),  # 필수: 버킷 이름
            "trainingDatasetAccessKey": os.getenv("NAVER_ACCESS_KEY"),  # 필수: 액세스 키
            "trainingDatasetSecretKey": os.getenv("NAVER_SECRET_KEY"),  # 필수: 시크릿 키
            "trainingDatasetFilePath": os.getenv("TRAINING_DATASET_FILE_PATH"),  # 필수: 파일 경로
            "trainEpochs": 8,  # 선택: 기본값 8
            "learningRate": 1.0E-4  # 선택: 기본값 1.0E-4
        }

    def get_headers(self):
        """API 요청 헤더 반환"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._api_key}"
        }

    def check_status(self, task_id):
        """학습 상태 확인"""
        status_url = self._host + self._status_uri.format(task_id=task_id)
        response = requests.get(status_url, headers=self.get_headers())
        return response.json()

    def execute(self, name=None, model=None, train_epochs=None, learning_rate=None, file_path=None):
        # 선택적 파라미터 업데이트
        if name:
            self.request_data["name"] = name
        if model:
            self.request_data["model"] = model
        if train_epochs:
            self.request_data["trainEpochs"] = train_epochs
        if learning_rate:
            self.request_data["learningRate"] = learning_rate
        if file_path:
            self.request_data["trainingDatasetFilePath"] = file_path

        # API 요청 실행
        response = requests.post(
            self._host + self._uri,
            json=self.request_data,
            headers=self.get_headers()
        )

        # 응답 처리
        result = response.json()
        if "status" in result and result["status"]["code"] == "20000":
            return result["result"]
        else:
            return result


def monitor_training(executor, task_id, check_interval=60):
    """학습 진행 상태를 모니터링"""
    import time
    
    print(f"\n학습 ID: {task_id} 모니터링 시작")
    print("상태가 'SUCCEEDED' 또는 'FAILED'가 될 때까지 모니터링합니다.")
    print("Ctrl+C를 눌러 모니터링을 중단할 수 있습니다.\n")
    
    try:
        while True:
            status_result = executor.check_status(task_id)
            if "result" in status_result:
                result = status_result["result"]
                status = result.get("status", "UNKNOWN")
                status_info = result.get("statusInfo", {})
                
                print(f"\n=== 학습 상태 업데이트 ===")
                print(f"상태: {status}")
                
                if status_info:
                    curr_epoch = status_info.get("currEpoch")
                    total_epochs = status_info.get("totalTrainEpochs")
                    if curr_epoch and total_epochs:
                        print(f"진행률: {curr_epoch}/{total_epochs} epochs")
                    
                    train_loss = status_info.get("trainLoss")
                    if train_loss:
                        print(f"학습 손실: {train_loss}")
                    
                    message = status_info.get("message")
                    if message:
                        print(f"메시지: {message}")
                
                if status in ["SUCCEEDED", "FAILED"]:
                    if status == "SUCCEEDED":
                        print("\n학습이 성공적으로 완료되었습니다!")
                    else:
                        print("\n학습이 실패했습니다.")
                        failure_reason = status_info.get("failureReason")
                        if failure_reason:
                            print(f"실패 이유: {failure_reason}")
                    break
            
            time.sleep(check_interval)
            
    except KeyboardInterrupt:
        print("\n모니터링이 사용자에 의해 중단되었습니다.")
        print("학습은 계속 진행됩니다. 나중에 task_id로 상태를 다시 확인할 수 있습니다.")


def main():
    # 모델 튜닝을 위한 설정값
    config = {
        "name": "vocab-quiz-tuning",  # 선택: 학습 이름
        "model": "HCX-003",  # 필수: 사용할 모델
        "train_epochs": 8,  # 선택: 학습 에포크 수
        "learning_rate": 1.0E-4,  # 선택: 학습률
        "file_path": "tuning_data_edit.jsonl"  # 필수: 학습 데이터 파일 경로
    }
    
    # CreateTaskExecutor 인스턴스 생성 및 실행
    executor = CreateTaskExecutor()
    result = executor.execute(
        name=config["name"],
        model=config["model"],
        train_epochs=config["train_epochs"],
        learning_rate=config["learning_rate"],
        file_path=config["file_path"]
    )
    
    # 결과 출력
    print("\n=== 튜닝 작업 생성 결과 ===")
    task_id = result.get('id', 'Unknown')
    print(f"작업 ID: {task_id}")
    print(f"상태: {result.get('status', 'Unknown')}")
    print(f"생성 시간: {result.get('createdDate', 'Unknown')}")
    
    # 학습 상태 모니터링 시작
    if task_id != 'Unknown':
        monitor_training(executor, task_id)


if __name__ == "__main__":
    main()
