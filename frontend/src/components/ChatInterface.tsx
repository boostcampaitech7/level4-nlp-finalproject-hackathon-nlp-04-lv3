import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageType, ChatAction } from '../types/chat'
import { ChatMessage } from './ChatMessage'
import 'styles/scrollbar.css'

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
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 메시지가 업데이트될 때마다, 스크롤을 가장 아래로 이동
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
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
      className={`flex flex-col rounded-[32px] bg-surface-primary-2 shadow-lg ${width} ${height} ${className}`}
    >
      {/* 채팅 메시지 영역 */}
      <div
        className="custom-scrollbar-small flex-1 space-y-4 overflow-y-auto scroll-smooth p-6"
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            messageSize={messageSize}
            index={index}
          />
        ))}
      </div>

      {/* 액션 버튼 영역 */}
      {actions.length > 0 && (
        <div className="px-6 py-2">
          <div className="flex flex-wrap justify-end gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="rounded-[14px] bg-button-secondary-1 px-4 py-2 text-base font-medium text-text-secondary transition-colors hover:bg-[#d8d8d8]"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력해 주세요"
            className="text-text-intermidiate flex-1 rounded-2xl bg-surface-secondary p-1.5 outline-none button-s focus:ring-2 focus:ring-accent-purple"
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-button-primary-1 transition-colors hover:bg-[#b89dff]"
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
