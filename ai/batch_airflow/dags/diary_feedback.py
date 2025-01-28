import os
import re
import json
import requests
from datetime import datetime, timedelta
from psycopg2.extras import Json
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from dotenv import load_dotenv

load_dotenv()


feedback_prompt = """#### 역할:   
당신은 글쓰기 역량이 부족한 학생에게 일기 숙제를 낸 글쓰기 선생님입니다.

#### 과제:  
학생이 작성한 일기를 읽고, 문장 단위의 피드백을 제공해 주세요. 아래 5가지 기준에 부합하지 않은 문장을 찾아 구체적인 피드백을  제시해 주세요.

#### 피드백 기준:
1. 쉽고 명확한 단어 사용: 이해하기 쉽고, 사실을 있는 그대로 표현하는 단어를 사용해야 합니다.  
예시: "현수는 하던 일을 멈추고 **생리 현상**을 해결했다." → "현수는 하던 일을 멈추고 **대변**을 보았다."  
예시: "박지성 선수는 **편평족**이다. → "박지성 선수는 **평발**이다."  
2. 문법 규칙 준수: **맞춤법**과 **띄어쓰기**를 정확히 지켜야 합니다.  
예시: "다행이 밥을 먹었다. → 다행히 밥을 먹었다."  
예시: "자기전 책 읽는 습관을 들이고 싶다." → "자기 전 책 읽는 습관을 들이고 싶다."  
3. 문장의 적정한 길이와 내용 준수: 문장은 **지나치게 길거나 과도하게 많은 내용을 담지 않도록 작성**해야 합니다.  
예시: “요즘은 뜨게질에 취미가 생겨 목도리도 뜨고 가방도 뜨고 그 덕분에 시간도 잘가고 잠만 자거나 티비만 보면서 시간을 보내지는 않는다.” → “요즘은 뜨개질에 취미가 생겨 목도리와 가방을 뜨고 있다. 그 덕분에 시간이 잘 가고 잠만 자거나 TV만 보지 않는다.”  
예시: "팀원들이 여러모로 배려를 해주기는 하지만, 연차가 낮은 나로서는 '점심에 이거 먹어요!' 하고 주장하기가 조금 힘들어졌다." → "팀원들이 여러모로 배려해 주지만, 연차가 낮아 점심 메뉴를 주장하기 어려워졌다."  
4. 능동태 사용: 내용을 간결하고 명확히 전달하기 위해 수동태 대신 능동태로 문장을 작성해야 합니다.  
예시: "작가에 의해 밧줄이 던져졌다." → "작가가 밧줄을 던졌다."  
예시: "회의는 7시에 개최될 예정입니다." → "회의 시간은 7시입니다."
5. 부사 최소화: 문장을 간결하게 유지하기 위해 **부사를 최소한으로 사용**해야 합니다.  
예시: "그는 문을 **매우 굳게** 닫았다." → "그는 문을 **굳게** 닫았다."

#### 요구 사항:
1. 피드백이 가장 필요한 문장 10개를 선정하고 이에 대한 피드백을 작성하세요.
2. 각 피드백에 다음 3가지 내용을 포함하여 작성하세요:
    - 기존 문장: 학생이 작성한 문장을 **그대로 제시**합니다.  
    - 이유 및 개선점: 5가지 기준 중 부합하지 않은 기준을 찾아, 그 이유를 설명하고 개선점을 제시합니다. 이때, **따뜻하고 친근한 어조**로 작성하세요.  
    - 수정 문장: 개선점을 반영하여 수정된 문장을 제시합니다.

#### 예시: 
**일기**:  
안경을 썼는데도 시야가 동그랗고 몽글몽글한 빛 덩어리로 겹쳐 보였다. 눈 앞으로는 길이 쭉 뻗어 있었지만 저 끄트머리의 건물 꼭대기를 바라보려 해도 초점이 잘 잡히지 않았다. 당장 코 앞의 내 손 조차 흐릿하게 퍼져 보이는데 먼 곳을 보려고 하다니 용기가 가상하다. 피곤했다. 마감 하나가 끝났다. 첫 출발을 하는 지하철에 앉아 약 40분을 꾸벅 졸다가 버스로 10 분 더. 이제는 익숙한 건물 지하로 들어가 손을 씻고 나오면 업무 시작 10분쯤 전이다. 컴퓨터 전원을 누르고 부팅을 기다리는 약간의 시간 사이에 진한 커피 한 잔을 내린다. 자리에 앉으면 코끝에서 앞으로 약 60cm의 거리를 둔 32인치 모니터 두 대, 타블렛 한 게와 기계식 백축 키보드 한 대, 각종 단축키를 등록한 게이밍용 마우스 한 개가 세팅되어 있다. 일요한 프로그램 여러개를 켜고 마지막으로 메일과 업무용 메신저들을 확인한다. 일을 시작 할 시간이다. 사람의 형상을 사랑한다. 아주 어릴 적 부터도 인형을 비롯해 그냥, 사람의 모양이 좋았다. 사람과 그 마음 자체를 사랑한다는 수많은 자들의 노랫말들보다도... 난 사람의 손가락, 손톱, 안구와 홍채와 뼈, 불거지는 힘줄등의 형체가 좋았다. 보드랍고 말랑거릴 것 같은 피붓결과 탄탄하게 조여지는 근육 사이의 고랑 같은 것이 좋았다. 미적으로 아름답기만 하다면 굳이 현실의 사람이 아니어도 좋았다. 아주 일부만 사람의 형태를 가진 것이어도 좋았다. 덕분에 사람 그 자체와 사람의 형태라는 것에 대한 정의가 매우 넓어졌었지. 속은 텅 비고 겉 껍질만 존재하는 형태들의 집합, 인식하는 것만이 존재하는 세상. 3D로 구현된 디지털 세계의 사람을 만드는 사람. 그게 나고 나의 일이다. 3D모델링은 시간이 오래 걸리는 작업이다. 기획서를 읽고 레퍼런스를 수집하고 형태를 만드는 것만이 다가 아니다. 눈이라는 것은 예민한 것이어서 조금만 어색한 점이 보여도 위화감을 느끼기 시작한다. 그런 눈을 설득시켜 아름다운 사람의 형태라는 것을 납득시켜야만 한다. 0.01mm의 위치 차이가 인상을 결정한다. 아주 미묘한 세기와 각도 차이로도 결과물의 느낌은 천차만별이다. 형태 위에 질감을 묘사하고 색감을 입히고 빛을 쏘이기 시작하며 '그럴 듯한 느낌'을 만드는 것에 시간을 많이 소모한다. 그런 작은 수정들을 수 천 수 만 번을 반복해 가며 결과물을 빚어 낸다. 피곤한 눈에 인공 눈물을 흘려 넣으며 드디어 초점마저 잡히지 않을 정도로 집중하는 8시간이 지나고 나면 하루치 일이 끝이 난다. 오늘은 얼마나 더 진짜같은, 혹은 환상과도 같이 아름다운 인간의 형체를 만들 수 있었는가? 집으로 돌아갈 때에는 출근 할 때 10분정도 버스를 타던 길을 그냥 걸어서 돌아간다. 퇴근길은 시원스레 뚫린 큰 길이다. 지하철역 까지는 장애물 등이 거의 없기 때문에 흐린 눈을 잠시 감고 걸어도 부딛히는 일 따위는 없다. 안경을 벗고 오른쪽을 흐르는 빛무리들을, 윤슬과도 같은 길잡이를 따라 걸어간다. 분명한 것 하나 없는 형체가 오히려 마음에 들었다. 눈 앞이 흐려도 걷는 발걸음은 멈추지 않는다. 노곤한 몸이 오히려 꿈 속 같은 기분이 들게 한다. 여느 때와 같은 퇴근길이다. 내일의 작업과 마감을 생각하면 설레는 마음을 도닥도닥하며 집으로 돌아간다.  
 
**학생 일기 피드백 (10개 문장 선정):**  
1. **기존 문장**: "눈 앞으로는 길이 쭉 뻗어 있었지만 저 끄트머리의 건물 꼭대기를 바라보려 해도 초점이 잘 잡히지 않았다."  
**이유 및 개선점**: "눈 앞"은 한 단어로 붙여 써야 해요. 띄어쓰기를 수정하면 더 자연스러워질 거예요! (기준 2: 띄어쓰기)  
**수정 문장**: "눈앞에는 길이 쭉 뻗어 있었지만 저 끄트머리의 건물 꼭대기를 바라보려 해도 초점이 잘 잡히지 않았다."  

2. **기존 문장**: "당장 코 앞의 내 손 조차 흐릿하게 퍼져 보이는데 먼 곳을 보려고 하다니 용기가 가상하다."  
**이유 및 개선점**: "코 앞"도 한 단어로 붙여 쓰고, "용기가 가상하다"는 표현보다 "대단하다"가 더 어울려요. (기준 1: 쉽고 명확한 단어, 기준 2: 띄어쓰기)  
**수정 문장**: "당장 코앞의 내 손조차 흐릿하게 퍼져 보이는데 먼 곳을 보려고 하다니 용기가 대단하다."  

3. **기존 문장**: "컴퓨터 전원을 누르고 부팅을 기다리는 약간의 시간 사이에 진한 커피 한 잔을 내린다."  
**이유 및 개선점**: 문장이 길어서 두 문장으로 나누면 더 깔끔해져요! (기준 3: 문장 길이)  
**수정 문장**: "컴퓨터 전원을 눌러 부팅을 기다린다. 그사이 진한 커피 한 잔을 내린다."  

4. **기존 문장**: "자리에 앉으면 코끝에서 앞으로 약 60cm의 거리를 둔 32인치 모니터 두 대, 타블렛 한 게와 기계식 백축 키보드 한 대, 각종 단축키를 등록한 게이밍용 마우스 한 개가 세팅되어 있다."  
**이유 및 개선점**: 장비 설명이 길어서 문장을 나누고, "세팅되어 있다"를 능동태로 바꾸면 좋아요! (기준 3: 문장 길이, 기준 4: 능동태)  
**수정 문장**: "자리에 앉으면 코끝에서 약 60cm 거리에 32인치 모니터 두 대가 있다. 타블렛 한 개, 기계식 백축 키보드, 게이밍용 마우스도 함께 세팅했다."  

5. **기존 문장**: "일을 시작 할 시간이다."  
**이유 및 개선점**: "시작 할"은 "시작할"로 붙여 써야 해요. (기준 2: 띄어쓰기)  
**수정 문장**: "일을 시작할 시간이다."  

6. **기존 문장**: "아주 어릴 적 부터도 인형을 비롯해 그냥, 사람의 모양이 좋았다."  
**이유 및 개선점**: "부터"는 "부터"로 수정하고, "아주"는 생략해도 의미가 충분해요. (기준 2: 맞춤법, 기준 5: 부사 최소화)  
**수정 문장**: "어릴 적부터도 인형을 비롯해 사람의 모양이 좋았다."  

7. **기존 문장**: "사람과 그 마음 자체를 사랑한다는 수많은 자들의 노랫말들보다도..."  
**이유 및 개선점**: "자들"보다 "사람들"이 더 자연스러워요. (기준 1: 쉽고 명확한 단어)  
**수정 문장**: "사람과 그 마음 자체를 사랑한다는 수많은 사람들의 노랫말보다도..."  

8. **기존 문장**: "불거지는 힘줄등의 형체가 좋았다."  
**이유 및 개선점**: "힘줄등"은 "힘줄 등"으로 띄어 써야 해요. (기준 2: 띄어쓰기)  
**수정 문장**: "불거지는 힘줄 등의 형체가 좋았다."  

9. **기존 문장**: "보드랍고 말랑거릴 것 같은 피붓결과 탄탄하게 조여지는 근육 사이의 고랑 같은 것이 좋았다."  
**이유 및 개선점**: "피붓결"은 "피부 결"로 띄어 쓰고, "조여지는" 대신 "조이는"이 더 간결해요. (기준 2: 띄어쓰기, 기준 4: 능동태)  
**수정 문장**: "보드랍고 말랑거릴 것 같은 피부 결과 탄탄하게 조이는 근육 사이의 고랑이 좋았다."  

10. **기존 문장**: "속은 텅 비고 겉 껍질만 존재하는 형태들의 집합, 인식하는 것만이 존재하는 세상."  
**이유 및 개선점**: "겉 껍질"은 "겉껍질"로 붙여 쓰고, 문장 끝에 마무리 표현을 추가해 보세요! (기준 2: 띄어쓰기, 기준 3: 내용 완결성)  
**수정 문장**: "속은 텅 비고 겉껍질만 존재하는 형태들의 집합, 인식하는 것만이 존재하는 세상이었다."  

**총평**:  
일기에서 작업 과정과 감정을 세밀하게 표현한 점이 정말 인상적이에요! 조금만 표현을 다듬으면 완성도가 훨씬 높아질 거예요. 특히 긴 문장을 나누고 띄어쓰기를 수정하면 읽기 편해질 거랍니다. 앞으로도 꾸준히 쓰다 보면 자연스러운 문장이 술술 나올 테니 화이팅입니다 :)"""


class CompletionExecutor:
    def __init__(self, model_name):
        if "HCX" in model_name:
            self._host = f"https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/{model_name}"
        else:
            self._host = f"https://clovastudio.stream.ntruss.com/testapp/v2/tasks/{model_name}/chat-completions"
        self._api_key = os.getenv("NAVER_API_KEY")

        self.request_data = {
            "topP": 0.3,
            "topK": 0,
            "maxTokens": 4096,
            "temperature": 0.5,
            "repeatPenalty": 5.0,
            "stopBefore": [],
            "includeAiFilters": True,
            "seed": 0,
        }

        self.prompt = [
            {
                "role": "system",
                "content": feedback_prompt,
            },
            {"role": "user", "content": None},
        ]

    def execute(self, diary):
        headers = {
            "Authorization": self._api_key,
            "Content-Type": "application/json; charset=utf-8",
        }
        self.prompt[1]["content"] = f"**일기**:  \n{diary}"
        self.request_data["messages"] = self.prompt
        print(self.request_data)

        response = requests.post(
            self._host,
            headers=headers,
            json=self.request_data,
        )

        response_body = response.json()
        return response_body["result"]["message"]["content"]


def parse_feedback_review(diary, feedback):
    patterns = {
        "original_sentence": r"\d+\.\s*\*\*기존 문장\*\*:\s*(.*?)\*\*이유 및 개선점\*\*",
        "feedback": r"\*\*이유 및 개선점\*\*:\s*(.*?)\*\*수정 문장\*\*",
        "updated_sentence": r"\*\*수정 문장\*\*:\s*(.*?)(?=\d+\.\s*\*\*기존 문장\*\*|\*\*총평\*\*)",
        "review": r"\*\*총평\*\*:(.*)",
    }

    data = {
        "original_sentence": list(),
        "feedback": list(),
        "updated_sentence": list(),
        "review": list(),
    }

    # 1. 일기 피드백과 리뷰 파싱하기
    for key, pattern in patterns.items():
        matches = re.findall(pattern, feedback, re.DOTALL)
        for match in matches:
            data[key].append(match.strip().strip('"'))

    # 2. 형식에 맞게 변환 (start_idx, end_idx, feedback, updated_sentence)
    feedbacks = []
    for idx, original_sentence in enumerate(data["original_sentence"]):
        matches = re.search(re.escape(original_sentence), diary)
        if matches:
            feedbacks.append(
                [
                    matches.start(),
                    matches.end(),
                    data["feedback"][idx],
                    data["updated_sentence"][idx],
                ]
            )
        else:
            feedbacks.append(
                [-1, -1, data["feedback"][idx], data["updated_sentence"][idx]]
            )

    if data["review"]:
        review = data["review"][0]
    else:
        review = ""

    return feedbacks, review


def generate_save_diary_feedback(api, **kwargs):
    diaries = kwargs["ti"].xcom_pull(task_ids="fetch_yesterday_diary")
    # SQL 결과가 dict이 아닌 list로 전달
    pg_hook = PostgresHook(postgres_conn_id="my_postgres_conn")

    for diary in diaries:
        diary_id = diary[0]
        text = diary[1]

        # 1. HCX로 일기 피드백 생성
        feedback = api.execute(text)
        print(f"Generated Feedback for Diary {diary_id}: {feedback}")

        # 2. 생성한 content에서 일기 피드백과 리뷰 파싱하기
        feedbacks, review = parse_feedback_review(text, feedback)
        if isinstance(feedbacks, (list, dict)):
            feedbacks = json.dumps(feedbacks, ensure_ascii=False)
        print(f"feedbacks: {feedbacks}")
        print(f"review: {review}")

        # 3. 일기 피드백과 리뷰 DB에 저장히기
        sql = """
        UPDATE DIARIES
        SET FEEDBACK = %s, REVIEW = %s, STATUS = 2
        WHERE DIARY_ID = %s
        """
        pg_hook.run(sql, parameters=(feedbacks, review, diary_id), autocommit=True)


default_args = {"owner": "airflow", "retries": 1, "retry_delay": timedelta(seconds=5)}

with DAG(
    dag_id="diary_feedback",
    default_args=default_args,
    start_date=datetime(2025, 1, 25),
    schedule_interval="0 1 * * *",
    catchup=True,
    tags=["diary_feedback"],
) as dag:
    completion_executor = CompletionExecutor(model_name="lmh7w4qy")

    # 1. 어제 제출한 일기 가져오기
    get_yesterday_diaries_task = PostgresOperator(
        task_id="fetch_yesterday_diary",
        postgres_conn_id="my_postgres_conn",
        sql="""
            SELECT diary_id, text
            FROM DIARIES
            WHERE created_at::date = '{{ macros.ds_add(ds, -1) }}'::date AND status = 1
        """,
        do_xcom_push=True,
    )

    # 2. 일기 피드백 생성하고 저장하기
    generate_save_diary_feedback_task = PythonOperator(
        task_id="generate_save_diary_feedback",
        python_callable=generate_save_diary_feedback,
        op_kwargs={"api": completion_executor},
    )

    get_yesterday_diaries_task >> generate_save_diary_feedback_task
