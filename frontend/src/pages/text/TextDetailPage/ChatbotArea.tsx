import { ChatInterface } from 'components/ChatInterface'
import { useCallback, useState } from 'react'
import { useTextChatMessagesStore } from 'stores/textChatmessagesStore'
import { ChatAction, ChatMessage } from 'types/chat'

const ChatbotArea = () => {
  const { messages, addMessage } = useTextChatMessagesStore()

  const chatActions: ChatAction[] = [
    {
      id: '1',
      label: '글의 주제',
      onClick: () => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          content: '이 글의 주제를 알려줘.',
          type: 'user',
          timestamp: new Date(),
        }
        addMessage(newMessage)
      },
    },
    {
      id: '2',
      label: '글 요약',
      onClick: () => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          content: '이 글을 짧게 요약해줘.',
          type: 'user',
          timestamp: new Date(),
        }
        addMessage(newMessage)
      },
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
