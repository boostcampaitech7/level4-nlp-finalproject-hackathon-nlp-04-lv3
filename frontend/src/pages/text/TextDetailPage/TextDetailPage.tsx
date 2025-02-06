import useTextData from 'hooks/temp.useTextData'
import { TitleBar } from './TitleBar'
import MainHelp from './MainHelp'
import TextContent from './TextContent'
import Button from 'components/Button'
import EasyExplainArea from './EasyExplainArea'
import ChatbotArea from './ChatbotArea'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TextDetailPage = () => {
  const { text_id } = useParams<{ text_id: string }>()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])
  const { data: textData, isLoading } = useTextData(textId)

  const navigate = useNavigate()

  const handleClickPrev = () => {
    navigate(`/text/${textId - 1}`)
  }

  const handleClickNext = () => {
    navigate(`/text/${textId + 1}`)
  }

  const handleClickQuiz = () => {
    navigate(`/text/${textId}/quiz`)
  }

  return (
    <div className="flex flex-grow justify-center bg-background-primary pb-[36px] pt-[24px]">
      {isLoading ? (
        <div>본문을 불러오는 중이에요.</div>
      ) : (
        !!textData && (
          <div className="flex w-4/5 flex-col gap-y-[12px]">
            <TitleBar title={textData.title} category={textData.category} />
            <MainHelp />
            <div className="flex flex-grow gap-x-[40px]">
              <div className="flex flex-col gap-y-[20px]">
                <TextContent text={textData.text} />
                <div className="flex justify-center gap-x-[22px]">
                  {textId > 0 && (
                    <Button
                      text="이전 글"
                      size="small"
                      showBackIcon={true}
                      onClick={handleClickPrev}
                    />
                  )}
                  <Button
                    text="퀴즈 풀기"
                    size="small"
                    onClick={handleClickQuiz}
                  />
                  <Button
                    text="다음 글"
                    size="small"
                    showFrontIcon={true}
                    onClick={handleClickNext}
                  />
                </div>
              </div>
              <div className="flex w-[346px] flex-col gap-y-[10px]">
                <EasyExplainArea />
                <ChatbotArea />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default TextDetailPage
