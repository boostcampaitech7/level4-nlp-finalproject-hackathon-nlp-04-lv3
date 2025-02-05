import { TodayText, QuizData, VocabData } from '../types/mainPage';

// 실제로는 fetch API를 사용하거나 axios를 사용하여 데이터를 가져오세요.
export const fetchTodayTexts = async (): Promise<TodayText[]> => {
  // 예시를 위해 더미 데이터를 반환
  // 실제로는 서버에서 데이터를 받아옵니다.
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          text_id: 511278047,
          title: '연금술사',
          category: '소설',
          content: '연금술사는 대상들 중 한 명이 가져다 준 책을 손에 들고 있다',
        },
        {
          text_id: 511278048,
          title: '데미안',
          category: '철학',
          content: '새는 알에서 나오기 위해 투쟁한다. 알은 세계다...',
        },
        {
          text_id: 511278049,
          title: '1984',
          category: '디스토피아',
          content: '모든 동물은 평등하다. 하지만 어떤 동물은 다른 동물들보다 더 평등하다.',
        },
      ]);
    }, 500)
  );
};

export const fetchTodayQuizzes = async (): Promise<QuizData[]> => {
  // 예시를 위해 더미 데이터를 반환
  // 실제로는 서버에서 데이터를 받아옵니다.
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          record_id: 123,
          vocab_id: 456,
          vocab: '사랑',
          hanja: '愛',
          dict_mean: '사랑의 사전적 의미',
          easy_explain: ['쉽게 풀이한 뜻'],
          correct_example: ['이것이 올바른 예문입니다.'],
          incorrect_example: '이건 잘못된 예문입니다.',
          quiz_id: 789,
          quiz_level: 1,
          quiz_question: ['단어의 의미를 선택하세요'],
          quiz_options: ['기쁨', '사랑', '슬픔', '분노'],
          quiz_correct: [true, false, false, false],
          quiz_user_answer: [2],
          quiz_answer: ['사랑'],
          quiz_answer_explain: ['사랑은 사람 간의 애정 표현입니다.'],
        },
        {
          record_id: 124,
          vocab_id: 457,
          vocab: '행복',
          hanja: '幸福',
          dict_mean: '행복의 사전적 의미',
          easy_explain: ['행복이란 즐겁고 만족스러운 상태입니다.'],
          correct_example: ['행복은 작은 것에서 시작됩니다.'],
          incorrect_example: '행복은 단순히 물질로 정의되지 않습니다.',
          quiz_id: 790,
          quiz_level: 2,
          quiz_question: ['다음 중 행복의 정의는 무엇인가요?'],
          quiz_options: ['불행', '행복', '고난', '사랑'],
          quiz_correct: [false, true, false, false],
          quiz_user_answer: [1],
          quiz_answer: ['행복'],
          quiz_answer_explain: ['행복은 사람의 심리적 안정감과 만족감을 의미합니다.'],
        },
        {
          record_id: 125,
          vocab_id: 458,
          vocab: '우정',
          hanja: '友情',
          dict_mean: '우정의 사전적 의미',
          easy_explain: ['우정이란 친구 사이의 정이 깊은 관계입니다.'],
          correct_example: ['우정은 서로가 서로를 도와주고 아껴주는 마음입니다.'],
          incorrect_example: '우정은 단순히 이해관계로 맺어지는 것이 아닙니다.',
          quiz_id: 791,
          quiz_level: 3,
          quiz_question: ['다음 중 우정의 정의는 무엇인가요?'],
          quiz_options: ['이해관계', '원망', '우정', '사랑'],
          quiz_correct: [false, false, true, false],
          quiz_user_answer: [2],
          quiz_answer: ['우정'],
          quiz_answer_explain: ['우정은 친구 간의 애정, 정서적 유대감, 상호 신뢰 등을 포괄하는 개념입니다.'],
        },
      ]);
    }, 500)
  );
};

export const fetchVocabData = async (vocab: string): Promise<VocabData> => {
  // 실제 API 호출 대신 더미 데이터 반환
  return {
    vocab_id: 12345678,
    vocab: vocab,
    hanja: "",
    dict_mean: "신의, 믿음, 관계, 인정 따위가 굳고 깊다.",
    easy_explain: "감정이나 연결이 아주 깊고 단단하다는 뜻이에요. 쉽게 말해, 친구나 가족과의 믿음이나 관계가 매우 굳고 가까운 상태를 말해요.",
    correct_example: [
      "그는 친구들과의 신뢰가 두터워 어떤 어려운 상황에서도 도움을 주고받았다.",
      "그들의 가족 간의 사랑은 세월이 흘러도 여전히 두텁다.",
      "두터운 우정을 쌓아 온 친구들이라 서로의 약점을 이해하고 감싸주었다.",
      "회사 내에서 동료들과의 신뢰가 두텁기 때문에 중요한 프로젝트를 맡을 수 있었다.",
      "선생님은 제자들과 두터운 정을 나누며 오랜 시간 가르침을 이어갔다."
    ],
    incorrect_example: [
      "그는 두터운 목소리로 노래를 불렀다.",
      "\"두텁다\"는 목소리와 같은 물리적 특성에는 쓰이지 않음."
    ]
  };
};
