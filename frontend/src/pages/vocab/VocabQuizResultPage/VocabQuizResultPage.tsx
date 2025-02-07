// VocabQuizResultPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'components/Button'
import useVocabQuizResult from 'hooks/useVocabQuizResult'

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

const VocabQuizResultPage = () => {
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

  const { data: vocabQuizResult, isLoading: isVocabQuizResultLoading } =
    useVocabQuizResult(qId)

  // VocabQuizResultPage.tsx
  const handleNextQuiz = () => {
    // 현재 vocab_id를 숫자로 변환 후 +1 증가
    const nextVocabId = Number(vocab_id) + 1
    navigate(`/vocab/${nextVocabId}`)
  }

  if (isVocabQuizResultLoading || !vocabQuizResult)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )

  const currentOptions = vocabQuizResult.options.slice(
    currentQuestionIndex * 4,
    (currentQuestionIndex + 1) * 4,
  )
  const currentExplanations = vocabQuizResult.answerExplain.slice(
    currentQuestionIndex * 4,
    (currentQuestionIndex + 1) * 4,
  )
  const correctAnswerIndex = vocabQuizResult.answer[currentQuestionIndex]
  const userAnswerIndex = vocabQuizResult.userAnswer[currentQuestionIndex]
  const isCorrect = vocabQuizResult.correct[currentQuestionIndex]

  return (
    <div className="flex min-h-screen w-full justify-center bg-background-primary">
      <div className="w-full max-w-[960px] px-4">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-text-primary title-m">
              퀴즈 결과를 확인해보세요!
            </h1>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-14 rounded-[32px] bg-surface-primary-2 px-5 py-[30px]">
            <div className="flex w-full flex-col items-start justify-start gap-7">
              <div className="inline-flex w-full flex-col items-center justify-center gap-2.5 px-[33px]">
                <h2 className="w-full font-bold text-text-primary body-l">
                  {vocabQuizResult.question[currentQuestionIndex]}
                </h2>
                <p
                  className={`w-full body-l ${
                    isCorrect ? 'text-accent-blue' : 'text-accent-red-1'
                  }`}
                >
                  {isCorrect ? '맞았어요!' : '다시 한번 볼까요?'}
                </p>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-5 px-[33px]">
                <div className="flex w-full flex-col gap-8">
                  {currentOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center">
                        <div
                          className={`text-[78px] font-semibold ${
                            index + 1 === correctAnswerIndex
                              ? 'text-accent-blue'
                              : index + 1 === userAnswerIndex
                                ? 'text-accent-red-1'
                                : 'text-[#e0e0e0]'
                          }`}
                        >
                          {index + 1 === correctAnswerIndex
                            ? 'O'
                            : index + 1 === userAnswerIndex
                              ? 'X'
                              : ''}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p
                          className={`body-m ${
                            index + 1 === userAnswerIndex
                              ? 'font-bold'
                              : 'font-normal'
                          }`}
                        >
                          {option}
                        </p>
                        <p className="mt-2 text-text-secondary body-s">
                          {currentExplanations[index]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full px-10">
              <Button
                text={
                  currentQuestionIndex < 2
                    ? '다음 문제 확인하기'
                    : '다음 단어 공부하기'
                }
                onClick={
                  currentQuestionIndex < 2
                    ? () => setCurrentQuestionIndex((prev) => prev + 1)
                    : handleNextQuiz
                }
                color="grey"
                size="large"
                plusClasses="w-full bg-[#e8e8e8] hover:bg-[#d8d8d8] text-[#707070]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VocabQuizResultPage
