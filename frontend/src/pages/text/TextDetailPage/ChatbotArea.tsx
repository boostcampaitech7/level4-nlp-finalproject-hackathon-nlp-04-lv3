import { ChatInterface } from 'components/ChatInterface'
import { useCallback, useState } from 'react'
import { ChatAction, ChatMessage } from 'types/chat'

const ChatbotArea = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '여기서 주인공의 심정이 어떨까?',
      type: 'user',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: '주인공은 혼란스럽지만 희망을 잃지 않으려 노력하는 것 같아요.',
      type: 'bot',
      timestamp: new Date(),
    },
  ])

  const chatActions: ChatAction[] = [
    {
      id: '1',
      label: '비슷한 말',
      onClick: () => console.log('비슷한 말 클릭'),
    },
    { id: '2', label: '반대말', onClick: () => console.log('반대말 클릭') },
    {
      id: '3',
      label: '추가 설명',
      onClick: () => console.log('추가 설명 클릭'),
    },
  ]

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])
  return (
    <div>
      <ChatInterface
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
