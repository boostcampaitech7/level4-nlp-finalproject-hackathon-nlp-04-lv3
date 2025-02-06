export interface TodayText {
  text_id: number;
  title: string;
  category: string;
  content: string;
}

export interface QuizData {
  record_id: number;
  vocab_id: number;
  vocab: string;
  hanja: string;
  dict_mean: string;
  easy_explain: string[];
  correct_example: string[];
  incorrect_example: string;
  quiz_id: number;
  quiz_level: number;
  quiz_question: string[];
  quiz_options: string[];
  quiz_correct: boolean[];
  quiz_user_answer: number[];
  quiz_answer: string[];
  quiz_answer_explain: string[];
}

export interface VocabData {
  vocab_id: number;
  vocab: string;
  hanja: string;
  dict_mean: string;
  easy_explain: string;
  correct_example: string[];
  incorrect_example: string[];
}
