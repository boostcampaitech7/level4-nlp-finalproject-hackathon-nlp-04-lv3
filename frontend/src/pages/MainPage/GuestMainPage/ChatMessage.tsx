import React from 'react'
import { ChatMessage as ChatMessageType } from '../../../types/chat'

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
        className={`px-6 py-2 rounded-3xl max-w-[80%] ${
          message.type === 'user'
            ? 'bg-surface-secondary rounded-tr-none'
            : 'bg-background-secondary rounded-tl-none'
        }`}
      >
        <p
          className={`text-text-primary ${messageSize} caption-s`}
        >
          {message.content}
        </p>
      </div>
    </div>
  )
}
