import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageType, ChatAction } from '../../types/chat'
import { ChatMessage } from './ChatMessage'

interface ChatInterfaceProps {
  messages: ChatMessageType[]
  actions?: ChatAction[]
  onSendMessage: (message: string) => void
  className?: string
  width?: string
  height?: string
  messageSize?: string
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  actions = [],
  onSendMessage,
  className = '',
  width = 'w-[400px]',
  height = 'h-[600px]',
  messageSize = 'text-[22px]',
}) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div
      className={`flex flex-col bg-surface-primary-2 rounded-[32px] shadow-lg ${width} ${height} ${className}`}
    >
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            messageSize={messageSize}
            index={index}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 액션 버튼 영역 */}
      {actions.length > 0 && (
        <div className="py-2">
          <div className="flex gap-2 justify-center">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="px-4 py-2 bg-button-secondary-1 rounded-[14px] text-text-secondary-1 text-base font-medium hover:bg-[#d8d8d8] transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="p-4 ">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력해 주세요"
            className="button-s flex-1 p-1.5 bg-surface-secondary-2 rounded-2xl text-text-intermidiate outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-button-primary-1 rounded-full flex items-center justify-center hover:bg-[#b89dff] transition-colors"
          >
            <svg  
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                fill="white"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
