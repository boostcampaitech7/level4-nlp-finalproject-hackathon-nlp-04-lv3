// VocabQuizResultPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'components/Button'

interface QuizResultData {
  quiz_id: number
  question: [string, string, string]
  options: [string, string, string, string, string, string, string, string, string, string, string, string]
  answer: [number, number, number]
  user_answer: number[]
  correct: boolean[]
  answer_explain: [string, string, string, string, string, string, string, string, string, string, string, string]
}

const VocabQuizResultPage = () => {
  const navigate = useNavigate()
  const { vocab_id} = useParams()
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    const loadResultData = () => {
      const savedData = sessionStorage.getItem('quizResult')
      if (!savedData) {
        navigate('/error', { state: '결과 데이터를 찾을 수 없습니다' })
        return
      }

      try {
        const parsedData = JSON.parse(savedData)
        if (!parsedData || !parsedData.question || !parsedData.options) {
          throw new Error('Invalid data format')
        }
        setQuizResult(parsedData)
      } catch (error) {
        console.error('결과 데이터 파싱 오류:', error)
        navigate('/error', { state: '결과 데이터 형식이 올바르지 않습니다' })
      }
    }

    loadResultData()
  }, [navigate])

  // VocabQuizResultPage.tsx
const handleNextQuiz = () => {
  // 현재 vocab_id를 숫자로 변환 후 +1 증가
  const nextVocabId = Number(vocab_id) + 1
  navigate(`/vocab/${nextVocabId}`)
}



  if (!quizResult) return <div className="flex justify-center items-center h-screen">Loading...</div>

  const currentOptions = quizResult.options.slice(currentQuestionIndex * 4, (currentQuestionIndex + 1) * 4)
  const currentExplanations = quizResult.answer_explain.slice(currentQuestionIndex * 4, (currentQuestionIndex + 1) * 4)
  const correctAnswerIndex = quizResult.answer[currentQuestionIndex]
  const userAnswerIndex = quizResult.user_answer[currentQuestionIndex]
  const isCorrect = quizResult.correct[currentQuestionIndex]

  return (
    <div className="flex justify-center w-full min-h-screen bg-background-primary">
      <div className="w-full max-w-[960px] px-4">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-[38px] font-bold text-text-primary">퀴즈 결과를 확인해보세요!</h1>
          </div>

          <div className="w-full px-5 py-[60px] bg-surface-primary-2 rounded-[32px] flex flex-col justify-center items-center gap-14">
            <div className="w-full flex-col justify-start items-start gap-7 flex">
              <div className="w-full px-[33px] flex-col justify-center items-center gap-2.5 inline-flex">
                <h2 className="w-full text-black text-[34px] font-bold">
                  {quizResult.question[currentQuestionIndex]}
                </h2>
                <p className={`w-full text-[34px] font-bold ${
                  isCorrect ? 'text-[#5e82ff]' : 'text-[#ff5757]'
                }`}>
                  {isCorrect ? '맞았어요!' : '틀렸어요!'}
                </p>
              </div>

              <div className="w-full px-[33px] flex-col justify-center items-center gap-5 flex">
                <div className="w-full flex flex-col gap-8">
                  {currentOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="w-20 h-20 flex items-center justify-center">
                        <div className={`text-[78px] font-semibold ${
                          index === correctAnswerIndex ? 'text-[#5e82ff]' :
                          index === userAnswerIndex ? 'text-[#ff5757]' : 'text-[#e0e0e0]'
                        }`}>
                          {index === correctAnswerIndex ? 'O' : index === userAnswerIndex ? 'X' : ''}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[32px] ${
                          index === userAnswerIndex ? 'font-bold' : 'font-normal'
                        }`}>
                          {option}
                        </p>
                        <p className="text-2xl text-[#707070] mt-2">
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
                    ? "다음 문제 확인하기" 
                    : "다음 단어 공부하기"
                }
                onClick={
                  currentQuestionIndex < 2 
                    ? () => setCurrentQuestionIndex(prev => prev + 1)
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