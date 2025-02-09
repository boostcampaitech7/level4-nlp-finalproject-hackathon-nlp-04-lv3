import sys
import json
from sqlmodel import Session

sys.path.append("../")
from core.database import engine
from models.text import Texts
from models.vocab import Vocabs
from models.text_quiz import TextQuizzes
from models.vocab_quiz import VocabQuizzes


def insert_texts(file_path, engine):
    with open(file_path, "r", encoding="utf-8") as file, Session(engine) as session:
        for line in file:
            row = json.loads(line)
            text = Texts(
                title=row["title"],
                type=row["type"],
                category=row["category"],
                content=row["content"],
            )
            print(text)
            session.add(text)
            session.commit()


def insert_text_quizzes(file_path, engine):
    with open(file_path, "r", encoding="utf-8") as file, Session(engine) as session:
        text_id = 0
        for index, row in enumerate(file):
            if index % 5 == 0:
                text_id += 1
            row = json.loads(row)
            assert text_id == row["text_id"]
            assert len(row["question"]) == 3
            assert len(row["answer"]) == 3
            assert len(row["answer_explain"]) == 3
            assert len(row["options"]) == 12
            text_quiz = TextQuizzes(
                text_id=row["text_id"],
                level=row["level"],
                question=row["question"],
                answer=row["answer"],
                answer_explain=row["answer_explain"],
                options=row["options"],
            )
            print(text_quiz)
            session.add(text_quiz)
            session.commit()


def insert_vocabs(file_path, engine):
    with open(file_path, "r", encoding="utf-8") as file, Session(engine) as session:
        for line in file:
            row = json.loads(line)  # 한 줄씩 JSON으로 변환
            assert len(row["easy_explain"]) == 5
            assert len(row["correct_example"]) == 5
            assert len(row["incorrect_example"]) == 2
            vocab = Vocabs(
                vocab=row["vocab"],
                hanja=row["hanja"],
                dict_mean=row["dict_mean"],
                easy_explain=row["easy_explain"],
                correct_example=row["correct_example"],
                incorrect_example=row["incorrect_example"],
            )
            print(vocab)
            session.add(vocab)
            session.commit()


def insert_vocab_quizzes(file_path, engine):
    with open(file_path, "r", encoding="utf-8") as file, Session(engine) as session:
        vocab_id = 0
        for index, row in enumerate(file):
            if index % 5 == 0:
                vocab_id += 1
            row = json.loads(row)
            assert len(row["question"]) == 4
            assert len(row["answer"]) == 4
            assert len(row["answer_explain"]) == 16
            assert len(row["options"]) == 16
            vocab_quiz = VocabQuizzes(
                vocab_id=vocab_id,
                level=row["level"],
                question=row["question"],
                answer=row["answer"],
                answer_explain=row["answer_explain"],
                options=row["options"],
            )
            print(vocab_quiz)
            session.add(vocab_quiz)
            session.commit()


if __name__ == "__main__":
    vocab_file = "vocab.jsonl"
    text_file = "text.jsonl"
    vocab_quiz_file = "vocab_quiz.jsonl"
    text_quiz_file = "text_quiz.jsonl"

    insert_vocabs(vocab_file, engine)
    insert_texts(text_file, engine)
    insert_vocab_quizzes(vocab_quiz_file, engine)
    insert_text_quizzes(text_quiz_file, engine)
