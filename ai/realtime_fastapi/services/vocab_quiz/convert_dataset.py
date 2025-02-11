import json

def create_tuning_data(question_data, c_id):
    """퀴즈 데이터를 튜닝 데이터셋 형식으로 변환"""
    
    # System Prompt 설정
    system_prompt = """당신은 한국어 퀴즈 생성 전문가입니다.
사용자가 입력하는 단어를 기반으로 학습 효과가 높은 퀴즈를 생성하세요.

퀴즈 생성 규칙:
1. 사용자 입력 단어의 의미를 학습할 수 있는 질문을 생성합니다.
2. 난이도에 따라 정답과 오답을 다르게 구성하여 점진적으로 학습할 수 있도록 합니다.
3. 난이도는 1~5단계이며, 각각의 수준에 맞는 어휘와 문장 구조를 사용합니다.
4. 질문 유형은 빈칸, 의미, 예문, 유의어를 포함해야 합니다."""
    
    # 데이터 변환
    tuning_data = {
        "System_Prompt": system_prompt,
        "C_ID": c_id,  # 각 문제마다 고유한 C_ID 부여
        "T_ID": 0,  # 싱글턴 형식으로 T_ID는 0으로 고정
        "Text": question_data.get("text", ""),  # 기존 text 필드 사용
        "Completion": question_data.get("completion", "")  # 기존 completion 필드 사용
    }
    
    return tuning_data

def convert_to_tuning_format(input_file, output_file):
    """JSONL 파일을 튜닝 데이터셋 형식으로 변환"""
    
    output_data = []
    c_id = 0
    
    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                # 각 줄을 JSON 객체로 파싱
                data = json.loads(line.strip())
                
                # 데이터 변환
                tuning_data = create_tuning_data(data, c_id)
                output_data.append(tuning_data)
                c_id += 1
                
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON in line {c_id + 1}: {str(e)[:100]}")
                print(f"Problematic line: {line[:100]}...")
                continue
            except Exception as e:
                print(f"Error processing line {c_id + 1}: {str(e)}")
                continue
    
    # 결과를 JSONL 파일로 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        for data in output_data:
            f.write(json.dumps(data, ensure_ascii=False) + '\n')
    
    print(f"변환된 데이터 수: {len(output_data)}")

def main():
    input_file = 'dict_vocab_quiz_output.jsonl'  # 입력 파일
    output_file = 'tuning_data_200.jsonl'  # 출력 파일
    
    convert_to_tuning_format(input_file, output_file)
    print(f"변환 완료: {output_file}")

if __name__ == '__main__':
    main()
