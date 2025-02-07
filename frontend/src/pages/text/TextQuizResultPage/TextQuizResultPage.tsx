import { useEffect, useMemo, useState } from 'react'
import { TitleBar } from './TitleBar'
import TextContent from '../TextQuizPage/TextContent'
import { useNavigate, useParams } from 'react-router-dom'
import useTextData from 'hooks/useText'
import TextQuizResultCard from './TextQuizResultCard'
import Button from 'components/Button'
import { useQueryClient } from '@tanstack/react-query'
import { TextDataType } from 'types/text'
import Modal from 'components/Modal'
import useTextQuizResult from 'hooks/useTextQuizResult'

const TextQuizResultPage = () => {
  const { text_id, quiz_id } = useParams<{ text_id: string; quiz_id: string }>()
  const tId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])
  const qId = useMemo(() => {
    const parsedQuizId = parseInt(quiz_id || '', 10)
    return isNaN(parsedQuizId) ? 0 : parsedQuizId
  }, [quiz_id])
  const { data: textData, isLoading: isTextLoading } = useTextData(tId)
  const { data: textQuizResult, isLoading: isTextQuizResultLoading } =
    useTextQuizResult(qId)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
  const handlieClickRetry = () => {
    setIsModalOpen(true)
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
                  text="다시풀기"
                  size="small"
                  onClick={handlieClickRetry}
                />
              </div>
            </div>
            <div className="flex min-w-[346px] flex-col gap-y-[10px]">
              {isTextQuizResultLoading ? (
                <div className="flex h-[660px] min-w-[345px] flex-col gap-y-[16px] rounded-[32px] bg-white-1 px-[20px] py-[15px] font-bold body-s">
                  해설을 준비 중이에요.
                </div>
              ) : (
                !!textQuizResult && (
                  <>
                    <TextQuizResultCard
                      questionIdx={0}
                      question={textQuizResult.question[0]}
                      options={textQuizResult.options.slice(0, 4)}
                      answer={textQuizResult.answer[0]}
                      answerExplain={textQuizResult.answerExplain[0]}
                      userAnswer={textQuizResult.userAnswer[0]}
                      correct={textQuizResult.correct[0]}
                    />
                    <TextQuizResultCard
                      questionIdx={1}
                      question={textQuizResult.question[1]}
                      options={textQuizResult.options.slice(4, 8)}
                      answer={textQuizResult.answer[1]}
                      answerExplain={textQuizResult.answerExplain[1]}
                      userAnswer={textQuizResult.userAnswer[1]}
                      correct={textQuizResult.correct[1]}
                    />
                    <TextQuizResultCard
                      questionIdx={2}
                      question={textQuizResult.question[2]}
                      options={textQuizResult.options.slice(8, 12)}
                      answer={textQuizResult.answer[2]}
                      answerExplain={textQuizResult.answerExplain[2]}
                      userAnswer={textQuizResult.userAnswer[2]}
                      correct={textQuizResult.correct[2]}
                    />
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          message="정말 다시 푸시겠어요?"
          onClose={() => setIsModalOpen(false)}
          title="다시 풀기"
          onConfirm={() => navigate(`/text/${tId}/quiz/${qId}`)}
        />
      )}
    </div>
  )
}

export default TextQuizResultPage
