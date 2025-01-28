import React from 'react'
import { ChatMessage as ChatMessageType } from 'types/chat'

interface ChatMessageProps {
  message: ChatMessageType
  messageSize: string
  index: number
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  messageSize,
}) => {
  return (
    <div
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] whitespace-pre-line rounded-3xl px-6 py-3 ${
          message.type === 'user'
            ? 'rounded-tr-none bg-surface-secondary'
            : 'rounded-tl-none bg-background-secondary'
        }`}
      >
        <p className={`text-text-primary ${messageSize} caption-s`}>
          {message.content}
        </p>
      </div>
    </div>
  )
}
