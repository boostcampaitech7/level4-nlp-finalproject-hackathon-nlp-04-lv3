import os
import json
import pandas as pd
import streamlit as st
from dotenv import load_dotenv

from feedback_generator import FeedbackGenerator
from feedback_evaluator import FeedbackComparator, FeedbackEvaluator
from prompt import feedback_prompt, evaluate_prompt

load_dotenv()


def view_diary_selections(df):
    select_options = [f'{_}: {row["title"]}' for _, row in df.iterrows()]
    selected_question = st.selectbox("일기를 선택하세요", select_options)
    selected_id = int(selected_question.split(":")[0])

    return selected_id


def view_feedback_selections(feedbacks, key):
    select_options = [
        f'{_}: {row["prompt"][1]["content"][:90]}' for _, row in enumerate(feedbacks)
    ]
    selected_question = st.selectbox(
        "일기를 선택하세요",
        select_options,
        key=key,
    )
    selected_id = int(selected_question.split(":")[0])

    return selected_id


def view_diary(text):
    st.markdown(
        f"""
        <div style='background-color: #f7f7ff; border-radius: 10px; padding: 20px;'>
        <div style='font-weight: bold; font-size: 20px; margin-bottom: 20px;'>일기: </div>
        {text}
        </div>
        """,
        unsafe_allow_html=True,
    )


def view_prompt(prompt):
    st.markdown(
        f"""
        <div style='background-color: #f7f7ee; border-radius: 10px; padding: 20px;'>
        <div style='font-weight: bold; font-size: 25px; margin-bottom: 20px;'>[시스템 프롬프트]</div>
        {prompt}
        </div>
        """,
        unsafe_allow_html=True,
    )


def view_feedback(feedback):
    st.markdown(
        f"""
        <div style='background-color: #f7f7ff; border-radius: 10px; padding: 20px;'>
        <div style='font-weight: bold; font-size: 20px; margin-bottom: 20px;'>일기 피드백: </div>
        {feedback}
        </div>
        """,
        unsafe_allow_html=True,
    )


def view_evaluate(feedback):
    st.markdown(
        f"""
        <div style='background-color: #f7f7ff; border-radius: 10px; padding: 20px;'>
        <div style='font-weight: bold; font-size: 20px; margin-bottom: 20px;'>일기 피드백 평가: </div>
        {feedback}
        </div>
        """,
        unsafe_allow_html=True,
    )


def main(
    api_keys,
    diary_file,
    feedback_save_file,
    feedback_file1,
    feedback_file2,
    evaluate_file,
):

    st.set_page_config(layout="wide")

    model_name = side_bar()

    tab1, tab2, tab3 = st.tabs(
        ["일기 피드백 받아보기", "일기 피드백 비교하기", "일기 피드백 평가 받아보기"]
    )
    with tab1:
        diary_df = pd.read_csv(diary_file)
        run_feedback_page(api_keys, model_name, diary_df, feedback_save_file)

    with tab2:
        with open(feedback_file1, "r", encoding="utf-8") as file:
            model1_feedbacks = [json.loads(line) for line in file]
        with open(feedback_file2, "r", encoding="utf-8") as file:
            model2_feedbacks = [json.loads(line) for line in file]
        compare_feedback_page(
            api_keys, model_name, model1_feedbacks, model2_feedbacks, evaluate_file
        )

    with tab3:
        model_selection = st.radio(
            "모델 선택",
            options=["모델1 일기 피드백", "모델2 일기 피드백"],  # 옵션 이름
            index=0,  # 기본 선택값 (0: 첫 번째 옵션)
        )
        if model_selection == "모델1 일기 피드백":
            with open(feedback_file1, "r", encoding="utf-8") as file:
                feedbacks = [json.loads(line) for line in file]
        else:
            with open(feedback_file2, "r", encoding="utf-8") as file:
                feedbacks = [json.loads(line) for line in file]
        evaluate_feedback_page(api_keys, model_name, feedbacks, evaluate_file)


def side_bar():
    # 사이드바 선택 항목 부분
    model_options_dict = [
        "gpt-4o-mini",
        "gpt-4o",
        "o1-mini",
        "deepseek-chat",
        "deepseek-reasoner",
        "HCX-003",
        "lmh7w4qy",
    ]
    st.sidebar.title("선택 항목")
    model_name = st.sidebar.radio("모델 이름", model_options_dict)
    return model_name


def run_feedback_page(api_keys, model_name, diary_df, feedback_file):
    feedback_generator = FeedbackGenerator(api_keys, model_name, diary_df)

    # 데이터 시각화
    idx = view_diary_selections(diary_df)
    selected_row = diary_df.iloc[idx]
    view_diary(selected_row["text"])

    # API 호출
    prompt = st.text_area("일기 피드백 프롬프트", height=200, value=feedback_prompt)
    view_prompt(prompt)

    if st.button("일기 피드백 요청"):
        _, result = feedback_generator.test(prompt, idx)
        view_feedback(result)

    with st.form(key="input_form1"):
        # 숫자 입력 필드
        num1 = st.number_input("시작 인덱스를 입력하세요:", value=0)
        num2 = st.number_input("마지막 인덱스를 입력하세요:", value=0)
        # 폼 제출 버튼
        submit_button = st.form_submit_button(label="다수 일기 피드백 요청")

    if submit_button:
        feedback_generator.run(feedback_file, prompt, num1, num2)


def compare_feedback_page(
    api_keys, model_name, model1_feedbacks, model2_feedbacks, evaluate_file
):
    feedback_comparator = FeedbackComparator(
        api_keys, model_name, model1_feedbacks, model2_feedbacks
    )

    idx = view_feedback_selections(model1_feedbacks, "compare")
    model1_feedback = model1_feedbacks[idx]["feedback"]
    model2_feedback = model2_feedbacks[idx]["feedback"]

    prompt = st.text_area(
        "일기 피드백 비교 프롬프트", height=200, value=evaluate_prompt
    )
    view_prompt(prompt)

    col1, col2 = st.columns(2)
    with col1:
        st.markdown("#### 모델1")
        view_feedback(model1_feedback)
    with col2:
        st.markdown("#### 모델2")
        view_feedback(model2_feedback)

    if st.button("일기 피드백 평가 요청", key="compare_button"):
        _, result = feedback_comparator.test(prompt, idx)
        view_evaluate(result)

    with st.form(key="input_form2"):
        # 숫자 입력 필드
        num1 = st.number_input("시작 인덱스를 입력하세요:", value=0)
        num2 = st.number_input("마지막 인덱스를 입력하세요:", value=0)
        # 폼 제출 버튼
        submit_button = st.form_submit_button(label="다수 일기 피드백 평가 요청")

    if submit_button:
        feedback_comparator.run(evaluate_file, prompt, num1, num2)


def evaluate_feedback_page(api_keys, model_name, feedbacks, evaluate_file):
    feedback_evaluator = FeedbackEvaluator(api_keys, model_name, feedbacks)

    idx = view_feedback_selections(feedbacks, "evaluate")
    feedback = feedbacks[idx]["feedback"]

    prompt = st.text_area(
        "일기 피드백 평가 프롬프트", height=200, value=evaluate_prompt
    )
    view_prompt(prompt)

    view_feedback(feedback)

    if st.button("일기 피드백 평가 요청", key="evaluate_button"):
        _, result = feedback_evaluator.test(prompt, idx)
        view_evaluate(result)

    with st.form(key="input_form3"):
        # 숫자 입력 필드
        num1 = st.number_input("시작 인덱스를 입력하세요:", value=0)
        num2 = st.number_input("마지막 인덱스를 입력하세요:", value=0)
        # 폼 제출 버튼
        submit_button = st.form_submit_button(label="다수 일기 피드백 평가 요청")

    if submit_button:
        feedback_evaluator.run(evaluate_file, prompt, num1, num2)


if __name__ == "__main__":
    api_keys = {
        "openai": os.getenv("OPENAI_API_KEY"),
        "deepseek": os.getenv("DEEPSEEK_API_KEY"),
        "naver": os.getenv("NAVER_API_KEY"),
    }
    diary_file = f"{os.getenv('TUNING_PATH')}/data/test_diary.csv"
    feedback_save_file = f"{os.getenv('TUNING_PATH')}/data/feedback.jsonl"
    feedback_file1 = f"{os.getenv('TUNING_PATH')}/data/HCX-003_feedback.jsonl"
    feedback_file2 = f"{os.getenv('TUNING_PATH')}/data/lmh7w4qy_feedback.jsonl"
    evaluate_file = f"{os.getenv('TUNING_PATH')}/data/HCX-003_evaluate.jsonl"
    evaluate_file = f"{os.getenv('TUNING_PATH')}/data/lmh7w4qy_evaluate.jsonl"

    main(
        api_keys=api_keys,
        diary_file=diary_file,
        feedback_save_file=feedback_save_file,
        feedback_file1=feedback_file1,
        feedback_file2=feedback_file2,
        evaluate_file=evaluate_file,
    )
