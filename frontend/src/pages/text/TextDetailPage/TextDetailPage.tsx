import useTextData from 'hooks/useText'
import { TitleBar } from './TitleBar'
import MainHelp from './MainHelp'
import TextContent from './TextContent'
import Button from 'components/Button'
import EasyExplainArea from './EasyExplainArea'
import ChatbotArea from './ChatbotArea'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TextDetailPage = () => {
  const { text_id } = useParams<{ text_id: string }>()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])
  const { data: textData, isFetching, refetch } = useTextData(textId)
  const [showTutorials, setShowTutorials] = useState<boolean>(false)
  const [tutorialStep, setTutorialStep] = useState<number>(1)

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

  useEffect(() => {
    if (textId >= 0) {
      refetch()
      window.scrollTo(0, 0)
    }
  }, [textId])

  const showNextTutorialStep = () => {
    if (tutorialStep < 4) {
      setTutorialStep((prev) => prev + 1)
    } else {
      setShowTutorials(false)
      setTutorialStep(1)
    }
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState<number>(0)
  const [left, setLeft] = useState<number>(0)
  useEffect(() => {
    if (containerRef.current) {
      setTop(containerRef.current.offsetTop)
      setLeft(containerRef.current.offsetLeft)
    }
  }, [containerRef])

  return (
    <div
      key={`textdetail-${textId}`}
      className="relative flex flex-grow justify-center bg-background-primary pb-[36px] pt-[24px]"
    >
      {showTutorials && (
        <div className="absolute top-0 z-30 h-full w-full bg-gray-700/70"></div>
      )}
      <div className="flex w-4/5 flex-col gap-y-[12px]">
        <TitleBar
          title={textData?.title || ''}
          category={textData?.category || ''}
        />
        <MainHelp
          setShowTutorials={setShowTutorials}
          setTutorialStep={setTutorialStep}
        />
        <div className="flex flex-grow gap-x-[40px]">
          <div ref={containerRef} className="flex flex-col gap-y-[20px]">
            <div className={`relative ${tutorialStep < 3 && 'z-40'}`}>
              {!isFetching && textData ? (
                <TextContent text={textData.content} left={left} top={top} />
              ) : (
                <div className="h-[660px] min-w-[771px] whitespace-pre-line rounded-[32px] bg-surface-primary-2 p-[20px] text-center text-text-primary body-m">
                  본문을 불러오는 중이에요.
                </div>
              )}
              {showTutorials && tutorialStep === 1 && (
                <div className="absolute left-0 top-[-12px] z-40 w-[300px] -translate-y-full transform rounded-[16px] bg-surface-primary-1 px-4 pb-6 pt-4 text-text-intermediate button-m">
                  <div className="relative h-full w-full">
                    글을 읽다가 모르는 부분이 있으면 드래그 해보세요!
                    <Button
                      text="다음"
                      showFrontIcon={true}
                      size="xsmall"
                      color="white"
                      onClick={showNextTutorialStep}
                      plusClasses="absolute right-0 bottom-[-10px]"
                    />
                  </div>
                </div>
              )}
              {showTutorials && tutorialStep === 2 && (
                <div className="absolute left-0 top-[-12px] z-40 w-[300px] -translate-y-full transform rounded-[16px] bg-surface-primary-1 px-4 py-6 text-text-intermediate button-m">
                  <div className="relative h-full w-full">
                    툴팁에서 "이 부분 쉽게 설명해줘" 버튼을 눌러보세요.
                    <Button
                      text="다음"
                      showFrontIcon={true}
                      size="xsmall"
                      color="white"
                      onClick={showNextTutorialStep}
                      plusClasses="absolute right-0 bottom-[-10px]"
                    />
                  </div>
                </div>
              )}
              {showTutorials && tutorialStep < 3 && (
                <div className="absolute left-0 top-0 z-40 h-full w-full rounded-[32px] bg-text-transparent p-[20px] shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)]">
                  <div
                    className={`${tutorialStep === 1 && 'animate-expand-contract'} relative ml-12 h-[36px] w-[320px] bg-drag body-s`}
                  ></div>
                  {tutorialStep === 2 && (
                    <div className="absolute left-[80px] top-[65px] flex h-[34px] items-center rounded-[16px] bg-background-primary text-text-primary shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] transition-opacity duration-300 button-s">
                      <button className="h-[34px] rounded-l-[16px] border-r-[1px] border-line bg-button-secondary-2 px-[10px] ring-4 ring-main">
                        이 부분 쉽게 설명해줘
                      </button>
                      <div
                        className={`flex items-center ${true ? 'gap-x-[10px]' : 'hover:bg-button-secondary-2'} h-[34px] rounded-r-[16px] px-[10px]`}
                      >
                        <button disabled={true}>질문하기</button>
                        <input
                          disabled={true}
                          type="text"
                          placeholder="질문을 입력하세요"
                          className={`h-[22px] overflow-hidden rounded-md bg-gray-200 text-gray-900 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300 ${true ? 'mx-[5px] w-[200px] px-2 py-1' : 'm-0 w-0 px-0'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-x-[22px]">
              {textId > 0 && (
                <Button
                  text="이전 글"
                  size="small"
                  showBackIcon={true}
                  onClick={handleClickPrev}
                />
              )}
              <Button text="퀴즈 풀기" size="small" onClick={handleClickQuiz} />
              <Button
                text="다음 글"
                size="small"
                showFrontIcon={true}
                onClick={handleClickNext}
              />
            </div>
          </div>
          <div className="flex w-[346px] flex-col gap-y-[10px]">
            <EasyExplainArea
              showTutorial={showTutorials && tutorialStep === 3}
              showNextTutorial={showNextTutorialStep}
            />
            <ChatbotArea
              showTutorial={showTutorials && tutorialStep === 4}
              showNextTutorial={showNextTutorialStep}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextDetailPage
