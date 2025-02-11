#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import google.generativeai as genai
from dotenv import load_dotenv
import pandas as pd
import json
import asyncio
import time
import random

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 65536,
  "response_mime_type": "text/plain",
}
# "gemini-2.0-pro-exp-02-05"
# gemini-2.0-flash-thinking-exp-01-21
model = genai.GenerativeModel(
  model_name="gemini-2.0-pro-exp-02-05",
  generation_config=generation_config,
  system_instruction="### **평가 프롬프트**\n\n**역할:** 당신은 빈틈이 없고 점수와 형식에 아주 엄격한 평가자입니다. 유저의 입력과 어시스턴트의 응답을 기반으로 단어 퀴즈의 품질을 평가하세요.\n\n### **평가 점수 체계**\n\n각 평가 기준은 0점(부적절)에서 5점(완벽)까지의 척도로 평가됩니다.\n\n일부 항목은 **0 또는 5점**(충족 여부)으로 평가하며, 총점은 가중치를 반영하여 계산됩니다.\n\n- 0점: 완전 부적절\n- 1점: 거의 충족하지 못함\n- 2점: 일부 충족\n- 3점: 대체로 충족\n- 4점: 기준을 잘 충족\n- 5점: 완벽하게 충족\n\n**0 또는 5점으로 평가되는 항목 (중요한 형식적 오류 반영)**\n\n하나라도 틀리면 0점, 모두 맞을 경우 5점\n\n- 정답-정답해설-선지 맵핑 정확성 (0/5)\n- 복수 정답 유무 (0/5)\n- 문제 유형 다양성 (0/5)\n- 출력 형식 준수 (0/5)\n\n---\n\n### **단어 퀴즈 평가 기준**\n\n1. **문제-입력 단어 연관성**\n    - 입력된 단어를 학습하는 데 적절한 문제인가?\n    - 해당 단어의 의미, 용례, 유의어 등을 반영했는가?\n2. **정답-선지-정답해설 맵핑 정확성(0 또는 5로 평가)**\n    - 정답 순서와 정답 해설의 순서가 정확하게 연결되어 있는가?\n    - answer의 각 숫자가 answer_explain에서의 정답의 순서을 정확하게 반영하는가?\n    - 0점 예시\n        \n        ```\n        \"answer\": [\n        0,\n        1,❌(answer_explain의 2번째 인덱스에 위치함)\n        2,\n        3\n        ],\n        \"answer_explain\": [\n        [\n        \"정답입니다. ...\",\n        \"오답입니다. ...\",\n        \"오답입니다. ...\",\n        \"오답입니다. ...\"\n        ],\n        [\n        \"오답입니다. ...\",\n        \"오답입니다. ...\",\n        \"정답입니다. ...\",❌(answer_explain이 answer와 다르게 2번째 인덱스에 위치함)\n        \"오답입니다. ...\"\n        ],\n        [\n        \"오답입니다. ...\",\n        \"오답입니다. ...\",\n        \"정답입니다. ...\",\n        \"오답입니다. ...\"\n        ],\n        [\n        \"오답입니다. ...\",\n        \"오답입니다. ...\",\n        \"오답입니다. ...\",\n        \"정답입니다. ...\"\n        ]\n        ```\n        \n3. **단계별 난이도 차별성**\n    - 난이도가 1~5단계로 명확하게 구분되었는가?\n    - 단계가 점진적으로 상승하면서 적절한 수준의 난이도를 제공하는가?\n4. **복수 정답 유무 (모든 문제는 단일 정답이어야 함, 0 또는 5로 평가))**\n    - 정답이 하나만 선택되도록 구성되었는가?\n    - 틀린 예시\n5. **해설 명료성**\n    - 정답과 오답에 대한 해설이 명확하고 이해하기 쉬운가?\n6. **문제 유형 다양성(0 또는 5로 평가)**\n    - 빈칸 채우기, 의미, 예문, 유의어 문제 유형이 하나씩 포함되었는가?\n7. **출력 형식 준수(0 또는 5로 평가)**\n    - 제시된 출력 형식을 정확히 따르고 있는가?\n    - 빈칸 채우기, 의미, 예문, 유의어 문제 유형이 하나씩 포함되었는가?\n    - 제시된 출력 형식\n        \n        ```\n        {\n          \"level\": 숫자(1~5),\n          \"question\": [\"빈칸 문제1\", \"의미 문제2\", \"예문 문제3\", \"유의어/반의어 문제4\"],\n          \"answer\": [숫자, 숫자, 숫자, 숫자],\n          \"answer_explain\": [\n            [\"오답 설명1\", \"정답 설명\", \"오답 설명2\", \"오답 설명3\"],\n            [\"정답 설명\", \"오답 설명1\", \"오답 설명2\", \"오답 설명3\"],\n            [\"오답 설명1\", \"오답 설명2\", \"오답 설명3\", \"정답 설명\"],\n            [\"오답 설명1\", \"오답 설명2\", \"정답 설명\", \"오답 설명3\"]\n          ],\n          \"options\": [\n            [\"선택지1\", \"선택지2\", \"선택지3\", \"선택지4\"],\n            [\"선택지1\", \"선택지2\", \"선택지3\", \"선택지4\"],\n            [\"선택지1\", \"선택지2\", \"선택지3\", \"선택지4\"],\n            [\"선택지1\", \"선택지2\", \"선택지3\", \"선택지4\"]\n          ]\n        }\n        ```\n        \n8. **학습 효과**\n    - 문제가 입력된 단어의 의미를 학습하는 데 직접적으로 기여하는가?\n    - 문제 풀이 후 학습자가 해당 단어를 더 잘 이해할 수 있도록 구성되었는가?\n    - 틀린 예시\n        \n        ```\n        유의어: '가무'는 '노래와 춤'을 줄여서 ( )라고 말합니다. ( ) 안에 알맞은 말을 고르세요.\"\n        ❌문제에 정답인 가무가 포함되어있어서 학습자가 고민할 여지가 없음\n        ```\n        \n\n---\n\n### **출력 예시 (평가 결과)**\n\n```json\n{\n\"피드백\": {\n    \"긍정적인 부분\": [\n      \"복수 정답 없이 단일 정답 유지됨.\",\n      \"오류가 적어 문법적으로 잘 구성됨.\"\n    ],\n    \"개선이 필요한 부분\": [\n      \"입력 단어와 문제의 연관성을 더 강화할 필요 있음.\",\n      \"정답과 정답해설, 선지 사이의 맵핑이 올바르지 않음.\",\n      \"출력 형식을 지키지 않음.\",\n      \"문제 유형이 다양하지 않음.\",\n      \"정답 해설이 불분명한 부분이 있어 개선 필요.\",\n      \"정답 분포가 다소 불균형함.\",\n      \"선택지가 너무 직관적이거나 쉽게 유추될 수 있음.\"\n    ]\n  },\n  \"총점\": 25/40,\n  \"평가\": {\n    \"문제-입력 단어 연관성\": 4,\n    \"정답-정답해설-선지 맵핑 정확성(0/5)\": 0,\n    \"단계별 난이도 차별성\": 4,\n    \"복수 정답 유무(0/5)\": 5,\n    \"해설 명료성\": 3,\n    \"문제 유형 다양성(0/5)\": 5,\n    \"출력 형식 준수(0/5)\": 0,\n    \"학습 효과\": 4,\n  },\n  \n}\n```",

)
# Function to read vocabulary data from CSV
def read_vocab_data(file_path):
    return pd.read_csv(file_path)

# Function to read quiz responses from JSONL
def read_quiz_responses(file_path):
    responses = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                response = json.loads(line)
                responses.append(response)
            except json.JSONDecodeError:
                continue
    return responses

# Function to evaluate a single quiz response with retry logic
async def evaluate_quiz_response(model, vocab_data, response, index, max_retries=5):
    base_delay = 2  # Base delay in seconds
    
    for attempt in range(max_retries):
        try:
            # Get the word and its meaning from vocab data
            word_info = vocab_data[vocab_data['vocab'] == response['word']]
            if word_info.empty:
                print(f"Warning: Word '{response['word']}' not found in vocabulary data")
                return None
            
            word_meaning = word_info['dict_mean'].iloc[0]
            
            # Calculate difficulty level (cycles through 1-5)
            difficulty = (index % 5) + 1
            
            # Prepare the prompt for evaluation
            prompt = f"""
사용자 요청: "난이도: {difficulty}, {response['word']}, {word_meaning}"

생성된 퀴즈:
{response['content']}
"""

            # Get evaluation from Gemini
            result = await model.generate_content_async(prompt)
            if not result or not result.text:
                print(f"Warning: Empty response from Gemini for word '{response['word']}'")
                return None
                
            evaluation_result = {
                'word': response['word'],
                'timestamp': response['timestamp'],
                'evaluation': result.text
            }
            return evaluation_result
            
        except Exception as e:
            error_str = str(e)
            
            # Check if it's a quota error (HTTP 429)
            if "429" in error_str:
                if attempt < max_retries - 1:
                    # For quota errors, use longer delays
                    delay = (base_delay ** (attempt + 2)) + random.uniform(0, 5)
                    print(f"API quota exceeded for word '{response['word']}'. Waiting {delay:.2f} seconds...")
                    time.sleep(delay)
                    continue
                else:
                    print(f"API quota exhausted after {max_retries} attempts. Please wait before retrying.")
                    # Add a long cooldown period after max retries
                    time.sleep(30)  # 30-second cooldown
                    return None
            
            # For other errors, use standard exponential backoff
            if attempt < max_retries - 1:
                delay = (base_delay ** attempt) + random.uniform(0, 1)
                print(f"Error evaluating quiz for word '{response['word']}': {error_str}")
                print(f"Retrying in {delay:.2f} seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(delay)
            else:
                print(f"Error evaluating quiz for word '{response['word']}' after {max_retries} attempts: {error_str}")
                return None

# Main function to process all responses
async def process_quiz_responses():
    try:
        # Read data
        vocab_data = read_vocab_data('/Users/imsang-yeob/Downloads/vocab_quiz/korean_vocab_meaning_50.csv')
        responses = read_quiz_responses('/Users/imsang-yeob/Downloads/vocab_quiz/text_quiz/quiz_responses_hcx_cleaned.jsonl')
        
        # 처음 100개만 선택
        responses = responses[:100]
        print(f"Processing first 100 quiz responses")
        
        # Initialize the file
        output_file = '/Users/imsang-yeob/Downloads/vocab_quiz/text_quiz/eval_result_hcx.jsonl'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('')  # Clear the file
        
        # Process and write results one by one
        with open(output_file, 'a', encoding='utf-8') as f:
            for i, response in enumerate(responses):
                result = await evaluate_quiz_response(model, vocab_data, response, i)
                if result:
                    # Write result immediately
                    json.dump(result, f, ensure_ascii=False)
                    f.write('\n')
                    f.flush()  # Force write to disk
                    print(f"Successfully evaluated and saved quiz {i+1}/100")
                
                # Add longer delay between requests to avoid rate limiting
                delay = random.uniform(1.5, 2.5)  # Randomized delay between 1.5 and 2.5 seconds
                time.sleep(delay)
        
        print("Evaluation complete!")
        
    except Exception as e:
        print(f"Error in process_quiz_responses: {str(e)}")

# Run the evaluation
if __name__ == "__main__":
    asyncio.run(process_quiz_responses())