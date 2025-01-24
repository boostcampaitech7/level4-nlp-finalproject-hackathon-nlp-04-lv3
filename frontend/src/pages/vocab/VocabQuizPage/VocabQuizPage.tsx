// VocabQuizPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'components/Button'
import Modal from 'components/Modal'

interface QuizData {
  quiz_id: number
  question: [string, string, string]
  options: [string, string, string, string, string, string, string, string, string, string, string, string]
}

interface QuizResultData {
  quiz_id: number
  question: [string, string, string]
  options: [string, string, string, string, string, string, string, string, string, string, string, string]
  answer: [number, number, number]
  user_answer: number[]
  correct: boolean[]
  answer_explain: [string, string, string, string, string, string, string, string, string, string, string, string]
}

const dummyQuizData: QuizData = {
  quiz_id: 111234567,
  question: [
    "다음 중 '독실한'이 올바르게 사용된 문장을 고르세요.",
    "'독실한'의 뜻으로 알맞은 것은?",
    "'독실한'과 유사한 단어를 고르세요."
  ],
  options: [
    "그는 독실한 신앙심으로 매일 기도한다.",
    "그녀는 독실한 운동 실력으로 상을 받았다.",
    "독실한 맛이 나는 음식이 좋다.",
    "그는 독실한 옷차림으로 파티에 참석했다.",
    "깊고 성실한 태도를 가진",
    "빠르고 날렵한",
    "화려하고 눈에 띄는",
    "느긋하고 여유로운",
    "집중하는",
    "충실한",
    "산만한",
    "방탕한"
  ]
}

const dummyQuizResult: QuizResultData = {
  quiz_id: 111234567,
  question: dummyQuizData.question,
  options: dummyQuizData.options,
  answer: [0, 0, 1],
  user_answer: [],
  correct: [],
  answer_explain: [
    "신앙심과 연결되어 올바른 사용입니다.",
    "'운동 실력'과는 어울리지 않는 표현입니다.",
    "'맛'과 연결되어 잘못된 사용입니다.",
    "단정한 옷차림과 같은 표현이 더 적절합니다.",
    "'독실한'의 의미와 맞습니다.",
    "'독실한'과는 무관합니다.",
    "화려하고 눈에 띄는",
    "느긋하고 여유로운",
    "집중하는",
    "충실한",
    "산만한",
    "방탕한"
  ]
}

const VocabQuizPage = () => {
  const navigate = useNavigate()
  const { vocab_id, level } = useParams<{ vocab_id: string; level: string }>()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const simulateApiCall = () => {
      setTimeout(() => {
        setQuizData(dummyQuizData)
        setIsLoading(false)
      }, 500)
    }
    simulateApiCall()
  }, [])

  useEffect(() => {
    setSelectedOption(userAnswers[currentQuestionIndex] ?? null)
  }, [currentQuestionIndex, userAnswers])

  const handleOptionSelect = (index: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = index
    setUserAnswers(newAnswers)
    setSelectedOption(index)

    if (currentQuestionIndex < 2) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 500)
    }
  }

  const handleResultCheck = () => {
    const isAllAnswered = quizData?.question.every(
      (_, index) => userAnswers[index] !== undefined
    )
    if (!isAllAnswered) {
      setShowModal(true)
      return
    }

    // 결과 처리 로직
  const result = {
    ...dummyQuizResult,
    user_answer: userAnswers as [number, number, number],
    correct: userAnswers.map((ans, idx) => 
      ans === dummyQuizResult.answer[idx]
    ) as [boolean, boolean, boolean]
  }

    sessionStorage.setItem('quizResult', JSON.stringify(result))
    navigate(`/vocab/${vocab_id}/quiz/${level}/result`)
  }
  // 프로그레스 바 클릭 핸들러 수정
const handleProgressClick = (index: number) => {
  setCurrentQuestionIndex(index)
  setSelectedOption(userAnswers[index] ?? null)
}
  if (isLoading || !quizData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-background-primary">
      <div className="w-full max-w-[960px] px-4">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-[38px] font-bold text-text-primary">퀴즈를 한번 풀어볼까요?</h1>
          </div>
          
          <div className="w-full px-5 py-[75px] bg-surface-primary-2 rounded-[32px] flex flex-col justify-center items-center gap-14">
            <div className="w-full flex-col justify-start items-start gap-[50px] flex">
              <div className="w-full justify-center items-start inline-flex">
                <div className="grow shrink basis-0 px-[33px]">
                  <div className="text-black text-[34px] font-bold font-['Pretendard']">
                    {quizData.question[currentQuestionIndex]}
                  </div>
                </div>
              </div>

              <div className="w-full px-[33px] pb-3.5 flex-col justify-center items-center gap-[30px] flex">
                {quizData.options
                  .slice(currentQuestionIndex * 4, (currentQuestionIndex + 1) * 4)
                  .map((option, index) => (
                    <button
                      key={index}
                      className={`w-full h-[70px] px-[34px] py-[5px] rounded-[20px] flex items-center gap-[3px] 
                        ${selectedOption === index ? 'bg-button-primary-1' : 'bg-[#f2f2f2] hover:bg-[#e2e2e2]'}`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="text-black text-[32px] font-normal">{option}</div>
                    </button>
                  ))}
              </div>
            </div>

            <div className="self-stretch w-full px-[29px] py-[20px] justify-center items-end gap-[5px] inline-flex">
              {quizData?.question.map((_, index) => (
                <button
                  key={index}
                  className={`grow shrink basis-0 h-[9px] rounded-[32px] transition-transform duration-200 transform origin-bottom hover:scale-y-150 cursor-pointer ${
                    currentQuestionIndex === index
                      ? 'bg-[#ffc9a2] scale-y-110'
                      : 'bg-[#f2f2f2] hover:bg-[#ffd8b9]'
                  }`}
                  onClick={() => handleProgressClick(index)}
                  aria-label={`문제 ${index + 1}`}
                />
              ))}
            </div>

            {currentQuestionIndex === 2 && selectedOption !== null && (
              <Button
                text="정답과 해설 확인하기"
                onClick={handleResultCheck}
                color="purple"
                size="large"
                plusClasses="w-full max-w-[400px]"
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="⚠️ 미완료된 문제"
        message={`${quizData.question.length - userAnswers.filter(Boolean).length}개의 문제가 남았습니다!`}
      />
    </div>
  )
}

export default VocabQuizPage