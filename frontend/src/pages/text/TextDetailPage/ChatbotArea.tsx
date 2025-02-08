import ChatInterface from 'components/ChatInterface'
import { ChatbotActionType } from 'types/chat'

const ChatbotArea = () => {
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
    <div>
      <ChatInterface
        actions={chatActions}
        width="w-[346px]"
        height="h-[464px]"
      />
    </div>
  )
}

export default ChatbotArea
