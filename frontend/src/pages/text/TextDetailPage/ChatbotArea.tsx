import ChatInterface from 'components/ChatInterface'
import { useCallback } from 'react'
import { useTextChatMessagesStore } from 'stores/textChatmessagesStore'
import { ChatbotActionType, ChatMessage } from 'types/chat'

const ChatbotArea = () => {
  const { messages, addMessage } = useTextChatMessagesStore()

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

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date(),
    }
    addMessage(newMessage)
  }, [])

  return (
    <div>
      <ChatInterface
        type="text"
        messages={messages}
        actions={chatActions}
        onSendMessage={handleSendMessage}
        width="w-[346px]"
        height="h-[464px]"
      />
    </div>
  )
}

export default ChatbotArea
