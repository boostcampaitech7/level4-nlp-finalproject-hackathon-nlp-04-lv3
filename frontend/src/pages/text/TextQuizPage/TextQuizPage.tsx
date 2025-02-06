import useTextData from 'hooks/temp.useTextData'
import { TitleBar } from '../TextDetailPage/TitleBar'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import TextContent from './TextContent'
import TextQuizCard from './TextQuizCard'
import useTextQuiz from 'hooks/temp.useTextQuiz'
import Button from 'components/Button'
import { useTextQuizUserAnswerStore } from 'stores/textQuizUserAnswerStore'
import { useQueryClient } from '@tanstack/react-query'
import { TextDataType } from 'types'

const TextQuizPage = () => {
  const { text_id, quiz_id } = useParams<{ text_id: string; quiz_id: string }>()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])
  const qId = useMemo(() => {
    const parsedQuizId = parseInt(quiz_id || '', 10)
    return isNaN(parsedQuizId) ? 0 : parsedQuizId
  }, [quiz_id])
  const { data: textData, isLoading: isTextLoading } = useTextData(textId)
  const { data: textQuiz, isLoading: isQuizLoading } = useTextQuiz(qId)

  const { quizId, userAnswer, setQuizId, resetQuizSolve } =
    useTextQuizUserAnswerStore()
  useEffect(() => {
    setQuizId(qId)
  }, [qId])

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isTextLoading) {
      queryClient.setQueryData<TextDataType>(['textData'], textData)
    }
  }, [isTextLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const navigate = useNavigate()
  const handleClickSubmit = () => {
    if (quizId == -1) {
      alert('오류가 발생했습니다. 새로고침 후 다시 이용해보세요.')
    } else {
      let unsolved: string[] = []
      userAnswer.forEach((answer, idx) => {
        if (![0, 1, 2, 3].includes(answer)) {
          unsolved.push(`${idx + 1}번`)
        }
      })
      if (unsolved.length != 0) {
        alert(
          `아직 ${unsolved.join(', ')} 문제를 안 풀었어요. 모든 문제를 풀어주세요.`,
        )
      } else {
        console.log('제출 API 연결')
        resetQuizSolve()
        navigate(`/text/${textId}/quiz/${qId}/result`)
      }
    }
  }

  return (
    <div className="flex justify-center bg-background-primary pb-[36px] pt-[24px]">
      {!!textData && (
        <div className="flex w-4/5 flex-col gap-y-[12px]">
          <TitleBar title={textData.title} category={textData.category} />
          <div className="flex gap-x-[40px]">
            <div className="sticky top-[126px] flex flex-col gap-y-[20px]">
              <TextContent text={textData.text} />
              <div className="flex justify-center gap-x-[22px]">
                <Button
                  text="제출하기"
                  size="small"
                  onClick={handleClickSubmit}
                />
              </div>
            </div>
            <div className="flex min-w-[346px] flex-col gap-y-[10px]">
              {isQuizLoading ? (
                <div className="flex h-[660px] min-w-[345px] flex-col gap-y-[16px] rounded-[32px] bg-white-1 px-[20px] py-[15px] font-bold body-s">
                  퀴즈를 준비 중이에요.
                </div>
              ) : (
                !!textQuiz && (
                  <>
                    <TextQuizCard
                      questionIdx={0}
                      question={`1. ${textQuiz?.question[0]}`}
                      options={textQuiz?.options.slice(0, 4)}
                    />
                    <TextQuizCard
                      questionIdx={1}
                      question={`2. ${textQuiz?.question[1]}`}
                      options={textQuiz?.options.slice(4, 8)}
                    />
                    <TextQuizCard
                      questionIdx={2}
                      question={`3. ${textQuiz?.question[0]}`}
                      options={textQuiz?.options.slice(8, 12)}
                    />
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextQuizPage
