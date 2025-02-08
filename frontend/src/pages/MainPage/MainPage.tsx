import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { PiHandsClappingDuotone } from 'react-icons/pi';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import customAxios from 'services/customAxios';

// 오늘의 글 데이터 타입 정의
interface TodayText {
  text_id: number;
  title: string;
  category: string;
  content: string;
}

interface QuizData {
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

// 실제로는 fetch API를 사용하거나 axios를 사용하여 데이터를 가져오세요.
const fetchTodayTexts = async (): Promise<TodayText[]> => {
  try {
    const response = await customAxios().get('/api/main/text');
    console.log(response.data);
    return response.data.slice(0, 3); // Get only first 3 items
  } catch (error) {
    console.error('Error fetching today texts:', error);
    throw error;
  }
};

const fetchTodayQuizzes = async (): Promise<QuizData[]> => {
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

const MainPage = () => {
  const navigate = useNavigate();

  // 검색
  const [searchTerm, setSearchTerm] = useState('');
  // 오늘의 글
  const [todayTexts, setTodayTexts] = useState<TodayText[]>([]);
  // 퀴즈
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  // 문제 풀이 중일 때: 현재 문제 인덱스
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 사용자 선택 답안 저장 (문제 수와 동일한 길이)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  
  const [showSolutionButton, setShowSolutionButton] = useState(false);
  // 모든 문제를 푼 뒤, 전체 해설 보기 단계로 전환
  const [showAllResults, setShowAllResults] = useState(false);
  // 전체 해설 보기에서, 현재 보고 있는 문제 번호
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [texts, quizzes] = await Promise.all([fetchTodayTexts(), fetchTodayQuizzes()]);
        setTodayTexts(texts);
        setQuizData(quizzes);
        setUserAnswers(Array(quizzes.length).fill(null));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // 문제 풀이 중: 보기 클릭 시 동작
  const handleAnswerClick = (selectedIndex: number) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = selectedIndex;
      
      // 모든 답변이 채워졌는지 확인
      if (newAnswers.every(answer => answer !== null)) {
        setShowSolutionButton(true);
      }
      
      return newAnswers;
    });
  
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1000);
  };

  // 문제 풀기 화면에서 ProgressBar 클릭 시 원하는 문제로 건너뛰기 (옵션)
  const handleProgressClick = (index: number) => {
    if (index >= 0 && index < quizData.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // 전체 해설 보기: 다음 문제 해설
  const handleNextSolution = () => {
    if (currentSolutionIndex < quizData.length - 1) {
      setCurrentSolutionIndex((prev) => prev + 1);
    } else {
      setShowCongrats(true);
    }
  };

  // 전체 해설 보기: 이전 문제 해설
  const handlePrevSolution = () => {
    if (currentSolutionIndex > 0) {
      setCurrentSolutionIndex((prev) => prev - 1);
    }
  };

  const getVocabData = (vocab: string) => {
        const axios = customAxios()
        return axios
        .get(`api/main/vocab/${vocab}`)
        .then((res) => {
          const {data} = res
          if (res.status != 200) {
            throw new Error('Failed to get vocab data')
          }
          console.log(data)
          const {vocab_id, vocab, hanja, dict_mean, easy_explain, correct_example, incorrect_example} = data
          return {vocab_id, vocab, hanja, dict_mean, easy_explain, correct_example, incorrect_example}
        })
        .catch((err) => {
          console.log(err)
          throw new Error('Failed to get vocab data')
        })

  };
  
  // 단어 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const data = await getVocabData(searchTerm);
      navigate(`/vocab/${data.vocab_id}`, { state: { vocabData: data } });
    } catch (error) {
      console.error('Search failed:', error);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // "문제 풀기" 화면 렌더링 함수
  const renderQuizInProgress = () => {
    const currentQuiz = quizData[currentQuestionIndex];
    if (!currentQuiz) return null;

    const userAnswerIndex = userAnswers[currentQuestionIndex] ?? -1;

    return (
      <div className="w-full min-h-[438px] pt-12 px-5 bg-surface-primary-2 rounded-[32px] flex flex-col justify-between space-y-[30px]">
  {/* 문제 */}
  <div className="space-y-[20px] pt-5 text-center">
    <h3 className="body-l">{currentQuiz.quiz_question[0]}</h3>
  </div>

  {/* 선택지 (2x2 grid) */}
  <div className="w-full grid grid-cols-2 gap-5">
    {currentQuiz.quiz_options.map((option, index) => (
      <button
        key={index}
        className={`w-full h-[50px] px-5 py-[5px] rounded-[20px] body-m text-left ${
          userAnswerIndex === index
            ? 'bg-button-primary-1 hover:bg-button-primary-2 transition-transform'
            : 'bg-background-primary hover:bg-button-secondary-1 transform hover:scale-105 transition-transform'
        }`}
        onClick={() => handleAnswerClick(index)}
      >
        {option}
      </button>
    ))}
  </div>

  {/* 진행도 표시 */}
  <ProgressBar
    total={quizData.length}
    current={currentQuestionIndex}
    onClick={handleProgressClick}
    className="mt-auto"
  />
</div>


    );
  };

  // "해설 보기" 화면 렌더링 함수 (하나씩 순서대로)
  const renderSolution = () => {
    const quiz = quizData[currentSolutionIndex];
    if (!quiz) return null;
    const userIndex = userAnswers[currentSolutionIndex] ?? -1;
    const correctIndex = quiz.quiz_correct.findIndex((c) => c === true);
    const isCorrect = userIndex === correctIndex;

    // OX 표시
    const getMark = (idx: number) => {
      if (idx === correctIndex) return 'O';
      if (idx === userIndex) return 'X';
      return '';
    };
    // OX 색깔
    const getMarkColor = (idx: number) => {
      if (idx === correctIndex) return 'text-accent-blue';
      if (idx === userIndex) return 'text-accent-red-1';
      return 'text-[#e0e0e0]';
    };

    return (
      <div className="w-full px-5 h-[438px] bg-surface-primary-2 rounded-[32px] flex flex-col justify-between items-center pb-5">
        {/* 질문 + 정오 여부 */}
        <div className="w-full mt-8 flex flex-col justify-center space-x-5 text-center">
          <h3 className="body-l">{quiz.quiz_question[0]}</h3>
          <p className={`body-l ${isCorrect ? 'text-accent-blue' : 'text-accent-red-1'}`}>
            {isCorrect ? '맞았어요!' : '다시 한번 볼까요?'}
          </p>
        </div>

        {/* 선택지 2x2 배치, 앞에 O/X 표시 */}
        <div className="w-full grid grid-cols-2 mt-4 gap-4">
          {quiz.quiz_options.map((option, i) => (
            <div
              key={i}
              className="relative w-full h-[50px] px-4 py-2 rounded-[20px] flex items-center gap-3 bg-background-primary"
            >
              <div className={`text-3xl font-bold ${getMarkColor(i)}`}>
                {getMark(i)}
              </div>
              <div className={`body-m ${i === userIndex ? 'font-bold' : 'font-normal'}`}>
                {option}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 해설 (스크롤 가능하도록 설정) */}
        <div className="w-full bg-white bg-opacity-20 p-4 rounded-xl flex-grow overflow-y-auto max-h-[150px]">
          <h4 className="body-m font-semibold mb-2">해설</h4>
          <p className="body-s text-text-secondary whitespace-pre-line">
            {quiz.quiz_answer_explain[0]}
          </p>
        </div>

        {/* 이전 / 다음 해설 이동 버튼 (최하단 고정) */}
        <div className="w-full flex justify-between gap-3 mt-auto flex-shrink-0">
          <Button
            text="이전 해설"
            onClick={handlePrevSolution}
            color="grey"
            size="small"
            disabled={currentSolutionIndex === 0}
          />
          <Button
            text={
              currentSolutionIndex < quizData.length - 1
                ? '다음 해설'
                : '학습 완료'
            }
            onClick={handleNextSolution}
            color="grey"
            size="small"
          />
        </div>
      </div>


    );
  };
  const renderCongrats = () => (
    <div className="w-full h-[438px] flex flex-col items-center justify-center gap-6 p-8 bg-surface-primary-2 rounded-[32px] animate-fade-in">
      <PiHandsClappingDuotone className="text-accent-yellow animate-bounce text-8xl" />
      <h2 className="text-3xl font-bold text-text-primary">참 잘했어요! 🎉</h2>
      <Button
        text="해설 다시보기"
        color="purple"
        size="small"
        onClick={() => setShowCongrats(false)}
      />
    </div>
  );
  
  return (
    <div className="relative">
      <div className="w-full min-h-screen bg-[#c9b2ff] flex justify-center items-center p-5">
        <div className="w-full max-w-[1440px] flex flex-col items-center gap-10">
          
          {/* 상단 영역: 제목 + 검색 */}
          <div className="w-full flex flex-col gap-4">
            <h1 className="text-[52px] font-bold">
              <span className="text-[#8a59ff]">아라부기</span>
              <span className="text-[#202020]">와 함께 오늘, 어떤 걸 배워볼까요?</span>
            </h1>
            <div className="h-[97.19px] w-full px-[41.57px] py-[23.10px] bg-surface-primary-2 rounded-[36.95px] inline-flex items-center gap-[23.10px]">
              <FaSearch
                className="text-[#707070] cursor-pointer"
                style={{ width: '34.64px', height: '34.64px', fontSize: '34.64px' }}
                onClick={handleSearch}
              />
              <input
                type="text"
                placeholder="단어 검색하기"
                className="w-[653.60px] text-[36.95px] font-medium leading-[50.81px] text-[#707070] placeholder-[#707070] focus:outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          {/* 메인 컨텐츠: 좌측 - 오늘의 글, 우측 - 퀴즈 or 해설 */}
          <div className="w-full flex justify-between items-start gap-5">
            {/* 왼쪽: 오늘의 글 */}
            <div className="flex-1 flex flex-col gap-8">
              <h2 className="text-[32px] font-semibold text-[#202020]">📖 오늘의 글</h2>
              {todayTexts.map((text) => (
                <div
                  key={text.text_id}
                  className="w-full p-[34px] py-5 bg-surface-primary-2 rounded-3xl flex flex-col gap-2 max-w-full overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center">
                      <span className="body-l text-text-primary truncate max-w-[480px] inline-block">{text.title} </span>
                      <span className="body-m text-text-secondary">/ {text.category}</span>
                    </div>
                    <Button
                      text="읽으러 가기"
                      color="purple"
                      size="small"
                      onClick={() => navigate(`/text/${text.text_id}`, { state: { textData: text } })}
                      plusClasses="min-w-[120px] whitespace-nowrap"
                    />
                  </div>
                  <p className="body-s text-text-secondary truncate max-w-[700px]">{text.content}</p>
                </div>
              ))}
            </div>

            {/* 오른쪽: 문제 풀이 or 해설 보기 */}
            <div className="w-[610px] flex gap-4 flex-col relative">
              <h2 className="title-m text-[#202020]">
                🧐 오늘의 복습 퀴즈
              </h2>

              {showSolutionButton && !showAllResults && (
                <Button
                  text="정답 및 해설"
                  size="small"
                  color="purple"
                  onClick={() => setShowAllResults(true)}
                  plusClasses="absolute right-4 top-[95px]" /* 우측 16px, 상단 70px */
                />
              )}

              <div className="mt-4"> {/* 컨텐츠 상단 여백 추가 */}
                {!showAllResults && renderQuizInProgress()}
                {showAllResults && (showCongrats ? renderCongrats() : renderSolution())}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
