import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageType, ChatAction } from '../../types/chat'
import { ChatMessage } from './ChatMessage'
import { FaPaperPlane } from 'react-icons/fa'
import '../../styles/safari.css'

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
        <div className="py-2 px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="button-s px-4 py-2 bg-button-secondary-1 rounded-[14px] text-text-secondary hover:bg-[#d8d8d8] transition-colors whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메세지를 입력하기"
            disabled
            className="button-s flex-1 min-w-0 py-2 px-4 bg-surface-secondary rounded-2xl text-text-intermidiate outline-none"
          />
          <button
            type="submit"
            disabled
            className="flex-shrink-0 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-surface-primary-1 opacity-50"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
