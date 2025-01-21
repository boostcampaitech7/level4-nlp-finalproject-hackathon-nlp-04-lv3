import React from 'react'
import { ChatMessage as ChatMessageType } from '../../types/chat'
import { useScrollTriggerAnimation } from '../../hooks/useScrollTriggerAnimation'

interface ChatMessageProps {
  message: ChatMessageType
  messageSize: string
  index: number
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  messageSize,
}) => {
  const messageRef = useScrollTriggerAnimation(message.id)

  return (
    <div
      ref={messageRef}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`px-6 py-3 rounded-3xl max-w-[80%] ${
          message.type === 'user'
            ? 'bg-[var(--color-surface-secondary)] rounded-tr-none'
            : 'bg-[var(--color-background-secondary)] rounded-tl-none'
        }`}
      >
        <p
          className={`text-[var(--color-text-primary)] ${messageSize} caption-s`}
        >
          {message.content}
        </p>
      </div>
    </div>
  )
}
