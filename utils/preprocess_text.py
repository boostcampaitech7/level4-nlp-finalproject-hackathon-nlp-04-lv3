import os
import json
import csv
import re
import random
from collections import defaultdict


# CSV 저장 전 텍스트 정리 함수
def clean_text_for_csv(text: str) -> str:
    if not isinstance(text, str):
        text = str(text)
    # 개행 문자 변환
    text = text.replace("\r\n", "\\n").replace("\r", "\\n").replace("\n", "\\n")
    # 제어 문자 제거 (0x00-0x1F 및 0x7F-0x9F 범위)
    text = re.sub(r"[\x00-\x1F\x7F-\x9F]", "", text)
    return text


# 요약문 및 레포트 생성 데이터(문학) 전처리 함수
def collect_summary_report_data(dir_path):
    rows = []
    for root, _, files in os.walk(dir_path):  # 폴더 내 모든 파일을 순회
        for file in files:
            if file.endswith(".json"):  # JSON 파일만 처리
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)  # JSON 파일 읽기
                    row = [
                        data.get("Meta(Acqusition)", {}).get("doc_id", ""),  # 문서 ID
                        data.get("Meta(Acqusition)", {}).get(
                            "doc_name", ""
                        ),  # 문서 제목
                        "문학",  # category = "문학"
                        "",
                        data.get("Meta(Acqusition)", {}).get("author", ""),  # 저자 정보
                        data.get("Meta(Refine)", {}).get("passage", ""),  # 본문 내용
                    ]
                    rows.append(row)
    return rows


# 도서 자료 요약 데이터 전처리 함수
def collect_book_material_data(dir_path):
    rows = []
    categories = ["예술", "사회과학", "기타", "기술과학"]  # 처리할 카테고리 목록
    for cat in categories:
        category_path = os.path.join(dir_path, cat)
        if not os.path.isdir(category_path):  # 폴더가 없으면 건너뜀
            continue

        for root, _, files in os.walk(category_path):  # 폴더 내 모든 파일을 순회
            for file in files:
                if file.endswith(".json"):  # JSON 파일만 처리
                    file_path = os.path.join(root, file)
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)  # JSON 파일 읽기
                        metadata = data.get("metadata", {})  # 메타데이터 가져오기
                        row = [
                            metadata.get("doc_id", ""),  # 문서 ID
                            metadata.get("doc_name", ""),  # 문서 제목
                            cat,  # category = 폴더명
                            metadata.get("kdc_label", ""),  # KDC 분류 라벨
                            metadata.get("publisher", ""),  # 출판사 정보
                            data.get("passage", ""),  # 본문 내용
                        ]
                        rows.append(row)
    return rows


# JSON 데이터 -> CSV 파일 변환 함수
def generate_text_data_csv(output_csv_path):
    # 폴더 경로 설정
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, ".."))

    # 요약문 및 레포트 생성 데이터 경로
    summary_report_dir = os.path.join(
        project_root, "text_data", "summary_report_generation_data"
    )
    # 도서 자료 요약 데이터 경로
    book_material_dir = os.path.join(
        project_root, "text_data", "book_material_summary_data"
    )

    # 데이터 수집
    summary_rows = collect_summary_report_data(summary_report_dir)
    book_rows = collect_book_material_data(book_material_dir)
    all_rows = summary_rows + book_rows  # 두 개의 데이터 병합

    # CSV 헤더 정의
    header = ["text_id", "title", "category", "kdc_label", "author", "content"]

    # CSV 파일 생성
    with open(output_csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(
            f, quoting=csv.QUOTE_MINIMAL, escapechar="\\", doublequote=False
        )
        writer.writerow(header)  # 헤더 작성

        for i, row in enumerate(all_rows):
            cleaned = [clean_text_for_csv(cell) for cell in row]  # 데이터 정리
            writer.writerow([i] + cleaned[1:])  # text_id를 0부터 부여

    print(f"[generate_text_data_csv] CSV 생성 완료: {output_csv_path}")


# CSV 파일 분석 함수
def analyze_csv(csv_path):
    # 카테고리별 문서 수를 저장하는 딕셔너리 (기본값 0)
    category_counts = defaultdict(int)
    # 카테고리별 content 길이의 총합을 저장하는 딕셔너리 (기본값 0)
    category_content_length = defaultdict(int)

    # CSV 파일 읽고 분석
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cat = row["category"]
            content = row["content"]
            category_counts[cat] += 1
            category_content_length[cat] += len(content)

    # 분석 결과 출력
    print(f"\n'{csv_path}' 카테고리별 분석 결과\n")
    for cat in sorted(category_counts.keys()):
        count = category_counts[cat]
        total_len = category_content_length[cat]
        avg_len = total_len / count if count > 0 else 0
        print(f"카테고리: {cat}")
        print(f"  문서 수: {count}")
        print(f"  content 전체 길이 합: {total_len}")
        print(f"  content 평균 길이: {avg_len:.1f}")
    print("")


# CSV 파일 필터링 및 샘플링 함수
def filter_and_sample_csv(
    input_csv, output_csv, min_len=500, max_len=1000, limit_per_cat=32
):
    # CSV 파일을 읽어서 content 길이가 조건을 만족하는 데이터만 저장
    rows = []
    with open(input_csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)  # CSV 파일을 딕셔너리 형태로 읽기
        for row in reader:
            content = row["content"]  # 현재 행의 본문(content) 가져오기
            if (
                min_len <= len(content) <= max_len
            ):  # 길이 조건(500~1000) 만족하는 경우만 저장
                rows.append(row)

    # 필터링된 데이터들을 카테고리별로 분류
    category_groups = defaultdict(list)
    for row in rows:
        cat = row["category"]  # 현재 행의 카테고리 가져오기
        category_groups[cat].append(row)  # 해당 카테고리 리스트에 추가

    # 각 카테고리별로 랜덤 샘플링하여 제한된 개수만 유지
    final_list = []
    for cat, cat_rows in category_groups.items():
        sampled_rows = random.sample(
            cat_rows, min(limit_per_cat, len(cat_rows))
        )  # 랜덤 샘플링 수행
        final_list.extend(sampled_rows)  # 샘플링된 데이터를 최종 리스트에 추가

    # 새로운 CSV 파일을 생성하여 필터링된 데이터를 저장
    with open(output_csv, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(
            f, quoting=csv.QUOTE_MINIMAL, escapechar="\\", doublequote=False
        )

        # CSV 헤더 작성
        writer.writerow(
            ["text_id", "title", "category", "kdc_label", "author", "content"]
        )

        # 필터링 및 샘플링된 데이터 저장
        for i, row in enumerate(final_list):
            writer.writerow(
                [
                    i,
                    row["title"],
                    row["category"],
                    row["kdc_label"],
                    row["author"],
                    row["content"],
                ]
            )

    print("\n필터링 및 샘플링 완료")  # 완료 메시지 출력


# 메인 실행 함수
def main():
    # 현재 파일 절대 경로 추출
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # 원본 CSV 파일 경로 설정 (JSON → CSV 변환 후 저장될 파일)
    text_data_csv = os.path.join(script_dir, "text_data.csv")
    # 필터링된 CSV 파일 경로 설정 (필터링 및 샘플링 후 저장될 파일)
    filtered_data_csv = os.path.join(script_dir, "filtered_text_data.csv")

    # 1. JSON 데이터를 읽어 text_data.csv 생성
    generate_text_data_csv(text_data_csv)
    # 2. 생성된 text_data.csv 파일을 분석하여 카테고리별 문서 수 및 content 길이 출력
    analyze_csv(text_data_csv)
    # 3. 특정 길이 범위(500~1000) 내의 문서만 남기고, 카테고리별 최대 32개씩 랜덤 샘플링 후 저장
    filter_and_sample_csv(text_data_csv, filtered_data_csv)
    # 4. 필터링된 filtered_text_data.csv 파일을 분석하여 최종 데이터 통계를 출력
    analyze_csv(filtered_data_csv)


if __name__ == "__main__":
    main()
