// VocabQuizPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'components/Button'
import Modal from 'components/Modal'
import ProgressBar from 'components/ProgressBar'
import useVocabQuiz from 'hooks/useVocabQuiz'

interface QuizData {
  quiz_id: number
  question: [string, string, string]
  options: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
}

interface QuizResultData {
  quiz_id: number
  question: [string, string, string]
  options: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
  answer: [number, number, number]
  user_answer: number[]
  correct: boolean[]
  answer_explain: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
}

const dummyQuizData: QuizData = {
  quiz_id: 111234567,
  question: [
    "다음 중 '독실한'이 올바르게 사용된 문장을 고르세요.",
    "'독실한'의 뜻으로 알맞은 것은?",
    "'독실한'과 유사한 단어를 고르세요.",
  ],
  options: [
    '그는 독실한 신앙심으로 매일 기도한다.',
    '그녀는 독실한 운동 실력으로 상을 받았다.',
    '독실한 맛이 나는 음식이 좋다.',
    '그는 독실한 옷차림으로 파티에 참석했다.',
    '깊고 성실한 태도를 가진',
    '빠르고 날렵한',
    '화려하고 눈에 띄는',
    '느긋하고 여유로운',
    '집중하는',
    '충실한',
    '산만한',
    '방탕한',
  ],
}

const dummyQuizResult: QuizResultData = {
  quiz_id: 111234567,
  question: dummyQuizData.question,
  options: dummyQuizData.options,
  answer: [0, 0, 1],
  user_answer: [],
  correct: [],
  answer_explain: [
    '신앙심과 연결되어 올바른 사용입니다.',
    "'운동 실력'과는 어울리지 않는 표현입니다.",
    "'맛'과 연결되어 잘못된 사용입니다.",
    '단정한 옷차림과 같은 표현이 더 적절합니다.',
    "'독실한'의 의미와 맞습니다.",
    "'독실한'과는 무관합니다.",
    '화려하고 눈에 띄는',
    '느긋하고 여유로운',
    '집중하는',
    '충실한',
    '산만한',
    '방탕한',
  ],
}

const VocabQuizPage = () => {
  const navigate = useNavigate()
  const { vocab_id, quiz_id } = useParams<{
    vocab_id: string
    quiz_id: string
  }>()
  const vocabId = useMemo(() => {
    const parsedId = parseInt(vocab_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [vocab_id])
  const qId = useMemo(() => {
    const parsedQuizId = parseInt(quiz_id || '', 10)
    return isNaN(parsedQuizId) ? 0 : parsedQuizId
  }, [quiz_id])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)

  const { data: vocabQuiz, isLoading: isQuizLoading } = useVocabQuiz(qId)

  useEffect(() => {
    console.log(vocabId)
    console.log(qId)
  }, [vocabId, qId])

  useEffect(() => {
    setSelectedOption(userAnswers[currentQuestionIndex] ?? null)
  }, [currentQuestionIndex, userAnswers])

  const handleOptionSelect = (index: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = index
    setUserAnswers(newAnswers)
    setSelectedOption(index)

    if (currentQuestionIndex < 2) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 500)
    }
  }

  const handleResultCheck = () => {
    const isAllAnswered = vocabQuiz?.question.every(
      (_, index) => userAnswers[index] !== undefined,
    )
    if (!isAllAnswered) {
      setShowModal(true)
      return
    }

    navigate(`/vocab/${vocabId}/quiz/${qId}/result`)
  }
  // 프로그레스 바 클릭 핸들러 수정
  const handleProgressClick = (index: number) => {
    setCurrentQuestionIndex(index)
    setSelectedOption(userAnswers[index] ?? null)
  }
  if (isQuizLoading || !vocabQuiz) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-background-primary">
      <div className="w-full max-w-[960px] px-4">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-text-primary title-m">
              퀴즈를 한번 풀어볼까요?
            </h1>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-14 rounded-[32px] bg-surface-primary-2 px-5 py-[75px]">
            <div className="flex w-full flex-col items-start justify-start gap-[50px]">
              <div className="inline-flex w-full items-start justify-center">
                <div className="shrink grow basis-0 px-[33px]">
                  <div className="text-text-primary title-m">
                    {vocabQuiz.question[currentQuestionIndex]}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-[30px] px-[33px] pb-3.5">
                {vocabQuiz.options
                  .slice(
                    currentQuestionIndex * 4,
                    (currentQuestionIndex + 1) * 4,
                  )
                  .map((option, index) => (
                    <button
                      key={index}
                      className={`flex h-[70px] w-full items-center gap-[3px] rounded-[20px] px-[34px] py-[5px] ${selectedOption === index ? 'bg-button-primary-1' : 'bg-background-primary hover:bg-button-secondary-1'}`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="text-text-primary body-m">{option}</div>
                    </button>
                  ))}
              </div>
            </div>

            <div className="inline-flex w-full items-end justify-center gap-[5px] self-stretch px-[29px] py-[20px]">
              <ProgressBar
                total={vocabQuiz.question.length || 0}
                current={currentQuestionIndex}
                onClick={handleProgressClick}
              />
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
        message={`${vocabQuiz.question.length - userAnswers.filter(Boolean).length}개의 문제가 남았습니다!`}
      />
    </div>
  )
}

export default VocabQuizPage
