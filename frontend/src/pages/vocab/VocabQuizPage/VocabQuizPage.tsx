// VocabQuizPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from 'components/Button'
import Modal from 'components/Modal'
import ProgressBar from 'components/ProgressBar'
import useVocabQuiz from 'hooks/useVocabQuiz'
import usePostVocabQuizSolve from 'hooks/usePostVocabQuizSolve'
import { useQuizUserAnswerStore } from 'stores/quizUserAnswerStore'

const VocabQuizPage = () => {
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

  const { quizSolve, setQuizId, setAnswer } = useQuizUserAnswerStore()
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    setQuizId(qId)
  }, [qId])

  const { data: vocabQuiz, isLoading: isQuizLoading } = useVocabQuiz(qId)

  useEffect(() => {
    console.log(vocabId)
    console.log(qId)
  }, [vocabId, qId])

  useEffect(() => {
    setSelectedOption(quizSolve.userAnswer[currentQuestionIndex] ?? null)
  }, [currentQuestionIndex, quizSolve.userAnswer])

  const handleOptionSelect = (index: number) => {
    setAnswer(currentQuestionIndex, index + 1)
    setSelectedOption(index)

    if (currentQuestionIndex < 2) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 500)
    }
  }

  const { mutate: submitQuizSolve } = usePostVocabQuizSolve(vocabId)
  const handleResultCheck = () => {
    const isAllAnswered = quizSolve.userAnswer.every((answer, _) => {
      return [1, 2, 3, 4].includes(answer)
    })
    if (!isAllAnswered) {
      setShowModal(true)
      return
    }
    submitQuizSolve(quizSolve)
  }
  // 프로그레스 바 클릭 핸들러 수정
  const handleProgressClick = (index: number) => {
    setCurrentQuestionIndex(index)
    setSelectedOption(quizSolve.userAnswer[index] ?? null)
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
        message={`${vocabQuiz.question.length - quizSolve.userAnswer.filter(Boolean).length}개의 문제가 남았습니다!`}
      />
    </div>
  )
}

export default VocabQuizPage
