# -*- coding: utf-8 -*-

import os
import uuid
import json
import time
import pandas as pd
from pathlib import Path
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

# Constants
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds
RATE_LIMIT_DELAY = 5  # seconds
VOCAB_FILE = '../korean_vocab_meaning_50.csv'

def load_vocabulary_data():
    """Load vocabulary data from CSV file"""
    try:
        df = pd.read_csv(VOCAB_FILE)
        vocab_data = []
        for _, row in df.iterrows():
            vocab_data.append({
                'vocab': row['vocab'],
                'dict_mean': row['dict_mean']
            })
        return vocab_data
    except Exception as e:
        print(f"Error loading vocabulary data: {str(e)}")
        return []

class CompletionExecutor:
    def __init__(self, host, api_key, request_id=None, output_file=None):
        self._host = host
        self._api_key = api_key
        self._request_id = request_id or str(uuid.uuid4()).replace('-', '')
        self._output_file = output_file or 'quiz_responses.jsonl'
        
    def _save_to_jsonl(self, content, word):
        """Save the content to a JSONL file with the word as metadata"""
        try:
            data = {
                'word': word,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'content': content
            }
            with open(self._output_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(data, ensure_ascii=False) + '\n')
            return True
        except Exception as e:
            print(f"Error saving to file: {str(e)}")
            return False

    def execute(self, completion_request, word):
        """Execute the completion request and save responses to JSONL"""
        headers = {
            'Authorization': self._api_key,
            'X-NCP-CLOVASTUDIO-REQUEST-ID': self._request_id,
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'text/event-stream'
        }

        current_content = ""
        
        for attempt in range(MAX_RETRIES):
            try:
                with requests.post(
                    self._host + '/testapp/v2/tasks/efa0zwsx/chat-completions',
                    headers=headers,
                    json=completion_request,
                    stream=True
                ) as response:
                    response.raise_for_status()
                    
                    for line in response.iter_lines():
                        if line:
                            decoded_line = line.decode('utf-8')
                            if decoded_line.startswith('data:'):
                                try:
                                    data = json.loads(decoded_line[5:])
                                    if 'message' in data and 'content' in data['message']:
                                        current_content = data['message']['content']
                                except json.JSONDecodeError:
                                    continue
                    
                    if current_content:
                        if self._save_to_jsonl(current_content, word):
                            print(f"\nSaved quiz for word '{word}' to {self._output_file}")
                        return current_content
                    
            except requests.exceptions.RequestException as e:
                if attempt < MAX_RETRIES - 1:
                    delay = RETRY_DELAY * (attempt + 1)
                    print(f"\nRetrying in {delay} seconds... (Attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(delay)
                    continue
                else:
                    print(f"\nFailed after {MAX_RETRIES} attempts: {str(e)}")
                    return None
            except Exception as e:
                print(f"\nUnexpected error: {str(e)}")
                return None

def create_quiz_request(vocab_item, difficulty):
    """
    Create a quiz generation request for the given vocabulary item and difficulty
    
    Args:
        vocab_item (dict): Dictionary containing vocab and dict_mean
        difficulty (int): Difficulty level (1-5)
    """
    system_message = {
        "role": "system",
        "content": """**사용자 입력을 기반으로 퀴즈를 생성하는 프롬프트**

💡 **목표:**  
- 사용자가 제공하는 단어를 기반으로 의미를 정확하게 학습할 수 있는 퀴즈를 생성합니다.  
- 초등학교 저학년부터 대학생까지 5단계 난이도로 각기 다른 난이도의 질문과 정답을 구성합니다.  
- 정답(0~3)이 골고루 분포되도록 설정합니다.

—

🔹 **프롬프트**  
당신은 한국어 퀴즈 생성 전문가입니다.  
사용자가 입력하는 단어를 기반으로 학습 효과가 높은 퀴즈를 생성하세요.  

 **퀴즈 생성 규칙:**  
1. 사용자 입력 단어의 **의미를 학습할 수 있는 질문**을 생성합니다. (무작위 질문 생성 X)
2. 난이도에 따라 **정답과 오답을 다르게** 구성하여 점진적으로 학습할 수 있도록 합니다.  
3. **난이도는 1~5단계**이며, 각각의 수준에 맞는 어휘와 문장 구조를 사용합니다.  
   - 1단계: 초등학교 저학년 수준  
   - 2단계: 초등학교 고학년 수준  
   - 3단계: 중학생 수준  
   - 4단계: 고등학생 수준  
   - 5단계: 대학생 수준  
4. **질문 유형 4가지**를 포함해야 합니다.  
   - 빈칸: 빈칸에 들어갈 단어를 고르세요.  
   - 의미: 단어의 의미에 맞는 선택지를 고르세요.  
   - 예문: 올바른 예문과 잘못된 예문을 구분하세요.  
   - 유의어: 단어와 유사한 의미를 가진 단어를 고르세요.  
5. **정답 (answer) 값은 0~3까지 고르게 분포되도록 설정**하세요.  
6. **각 문제의 정답과 해설, 선택지는 정확히 매핑**되어야 합니다.  
7. **다음 형식대로 출력합니다.**
   - level: 난이도 (1~5)  
   - question(4개): 문제  
   - answer(4개): 정답 인덱스 (0~3)  
   - answer_explain(16개): 각 선택지에 대한 해설  
   - options(16개): 4개 문항의 선택지들

**생성예시**
{
  "level": 1,
  "question": [
    "빈칸:  매일 꾸준히 숙제를 하는 것은 ______을 보여주는 좋은 예입니다.",
    "의미: '성실성'과 가장 비슷한 뜻을 가진 낱말은 무엇일까요?",
    "예문: 다음 중 '성실성'을 나타내는 올바른 문장을 고르세요.",
    "유의어: '꾸준함'은 '성실성'과 ( ) 의미가 같은 낱말입니다. ( ) 안에 알맞은 말을 고르세요."
  ],
  "answer": [0, 1, 2, 3],
  "answer_explain": [
    [
      "정답입니다. 성실성은 꾸준하고 꼼꼼하게 일을 처리하는 태도를 의미합니다.",
      "오답입니다. 게으름은 성실성과 반대되는 태도입니다.",
      "오답입니다. 창의성은 새로운 것을 생각해내는 능력입니다.",
      "오답입니다. 즐거움은 기쁘고 만족스러운 감정입니다."
    ],
    [
      "오답입니다. 기쁨은 즐겁고 행복한 감정입니다.",
      "정답입니다. 근면은 부지런하고 성실하게 일하는 태도를 의미하며, 성실성과 유사한 뜻입니다.",
      "오답입니다. 슬픔은 괴롭고 안타까운 감정입니다.",
      "오답입니다. 용기는 두려움을 무릅쓰고 나아가는 마음입니다."
    ],
    [
      "오답입니다. '가끔 숙제를 잊어버려요.'는 성실한 태도를 보여주지 않습니다.",
      "오답입니다. '숙제보다 노는 게 더 재미있어요.'는 성실성과 관련이 없습니다.",
      "정답입니다. '매일 숙제를 꼼꼼히 해요.'는 성실하게 과제를 수행하는 모습을 나타냅니다.",
      "오답입니다. '숙제는 너무 많아서 힘들어요.'는 숙제의 양에 대한 불만일 뿐 성실성과 직접적인 관련이 없습니다."
    ],
    [
      "오답입니다. '전혀'는 반대되는 의미를 나타냅니다.",
      "오답입니다. '약간'은 부분적으로만 같은 의미임을 나타냅니다.",
      "오답입니다. '반대'는 완전히 다른 의미임을 나타냅니다.",
      "정답입니다. '비슷한'은 '꾸준함'과 '성실성'이 서로 유사한 의미를 가짐을 나타냅니다."
    ]
  ],
  "options": [
    ["성실성", "게으름", "창의성", "즐거움"],
    ["기쁨", "근면", "슬픔", "용기"],
    ["가끔 숙제를 잊어버려요.", "숙제보다 노는 게 더 재미있어요.", "매일 숙제를 꼼꼼히 해요.", "숙제는 너무 많아서 힘들어요."],
    ["전혀", "약간", "반대", "비슷한"]
  ]
}"""
    }
    
    user_message = {
        "role": "user",
        "content": f"난이도: {difficulty}, {vocab_item['vocab']}, {vocab_item['dict_mean']}"
    }
    
    return {
        'messages': [system_message, user_message],
        'topP': 0.8,
        'topK': 0,
        'maxTokens': 4096,
        'temperature': 0.5,
        'repeatPenalty': 5.0,
        'stopBefore': [],
        'includeAiFilters': True,
        'seed': 0
    }

def process_vocabulary_item(vocab_item, delay_between_requests=1, output_file=None):
    """
    Process a vocabulary item for all difficulty levels
    
    Args:
        vocab_item (dict): Dictionary containing vocab and dict_mean
        delay_between_requests (int): Delay in seconds between API requests
        output_file (str): Path to the output JSONL file
    """
    completion_executor = CompletionExecutor(
        host='https://clovastudio.stream.ntruss.com',
        api_key=f"Bearer {os.getenv('NAVER_API_KEY')}",
        output_file=output_file
    )
    
    for difficulty in range(1, 6):
        print(f"\nGenerating quiz for word '{vocab_item['vocab']}' at difficulty level {difficulty}")
        request_data = create_quiz_request(vocab_item, difficulty)
        response = completion_executor.execute(request_data, vocab_item['vocab'])
        
        if response:
            print(f"Quiz generation successful for word '{vocab_item['vocab']}' at level {difficulty}")
        
        # Add delay between requests to avoid rate limiting
        if delay_between_requests > 0:
            time.sleep(delay_between_requests)

def main():
    """Main function to process vocabulary items"""
    output_file = 'quiz_responses.jsonl'
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Load vocabulary data
    vocab_data = load_vocabulary_data()
    if not vocab_data:
        print("No vocabulary data loaded. Exiting.")
        return
    
    print(f"Loaded {len(vocab_data)} vocabulary items")
    
    # Process each vocabulary item
    for vocab_item in vocab_data:
        process_vocabulary_item(vocab_item, delay_between_requests=2, output_file=output_file)

if __name__ == "__main__":
    main()