# -*- coding: utf-8 -*-

import os
import google.generativeai as genai
import csv
import pandas as pd

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Define the system instruction with clear formatting and documentation
SYSTEM_INSTRUCTION = """**사용자 입력을 기반으로 퀴즈를 생성하는 프롬프트**

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

# Create the model with configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-pro-exp-02-05",
    generation_config=generation_config,
    system_instruction=SYSTEM_INSTRUCTION
)

def process_vocabulary(word):
    try:
        # Create chat session
        chat = model.start_chat()
        
        # Send the word and get response
        response = chat.send_message(f"단어: {word}")
        
        # Get the response text and remove the ```json and ``` markers
        text = response.text
        if text.startswith('```json'):
            text = text[7:]  # Remove ```json
        elif text.startswith('```'):
            text = text[3:]  # Remove ```
        if text.endswith('```'):
            text = text[:-3]  # Remove trailing ```
        
        # Return the cleaned response text
        return text.strip()
        
    except Exception as e:
        print(f"Error processing word {word}: {str(e)}")
        return None

def main():
    # Read input words from CSV, skipping the header row
    input_file = "dict_vocab_1.csv"
    output_file = "dict_vocab_quiz_output.jsonl"
    
    word_meanings = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)  # Skip the header row
        for row in reader:
            vocab = row[0]
            dict_mean = row[1]
            word_meanings.append(f"{vocab}, {dict_mean}")
    
    # Process each word and save to JSONL
    with open(output_file, 'w', encoding='utf-8') as f:
        for word_meaning in word_meanings:
            response = process_vocabulary(word_meaning)
            if response:
                f.write(response + '\n')
                print(f"Processed: {word_meaning}")

if __name__ == "__main__":
    main()