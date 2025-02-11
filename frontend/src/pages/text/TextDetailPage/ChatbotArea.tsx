import { Button } from 'components'
import ChatInterface from 'components/ChatInterface'
import { ChatbotActionType } from 'types/chat'

const ChatbotArea = ({
  showTutorial,
  showNextTutorial,
}: {
  showTutorial: boolean
  showNextTutorial: () => void
}) => {
  const chatActions: ChatbotActionType[] = [
    {
      id: '1',
      label: '글의 주제',
      question: '이 글의 주제를 알려줘.',
    },
    {
      id: '2',
      label: '글 요약',
      question: '이 글을 짧게 요약해줘.',
    },
  ]

  return (
    <div className={`relative ${showTutorial && 'z-40'}`}>
      <ChatInterface
        actions={chatActions}
        width="w-[346px]"
        height="h-[464px]"
      />
      {showTutorial && (
        <div className="absolute left-0 top-0 h-full w-full rounded-[32px] bg-text-transparent shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)]"></div>
      )}
      {showTutorial && (
        <div className="absolute left-[-12px] top-0 z-40 w-[300px] -translate-x-full transform rounded-[16px] bg-surface-primary-1 px-4 py-6 text-text-intermediate button-m">
          <div className="relative h-full w-full">
            더 궁금한 게 있을 때는 챗봇에게 질문해보세요!
            <Button
              text="완료"
              showFrontIcon={true}
              size="xsmall"
              color="white"
              onClick={showNextTutorial}
              plusClasses="absolute right-0 bottom-[-10px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatbotArea
