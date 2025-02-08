import { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageType, ChatAction } from '../../../types/chat'
import ChatMessage from './ChatMessage'
import { FaPaperPlane } from 'react-icons/fa'
import '../../../styles/safari.css'

interface ChatInterfaceProps {
  messages: ChatMessageType[]
  actions?: ChatAction[]
  onSendMessage: (message: string) => void
  className?: string
  width?: string
  height?: string
  messageSize?: string
}

const ChatInterface = ({
  messages,
  actions = [],
  onSendMessage,
  className = '',
  width = 'w-[400px]',
  height = 'h-[600px]',
  messageSize = 'text-[22px]',
}: ChatInterfaceProps) => {
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
      className={`flex flex-col rounded-[32px] bg-surface-primary-2 shadow-lg ${width} ${height} ${className}`}
    >
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
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
        <div className="px-4 py-2">
          <div className="flex flex-wrap justify-center gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="whitespace-nowrap rounded-[14px] bg-button-secondary-1 px-4 py-2 text-text-secondary transition-colors button-s hover:bg-[#d8d8d8]"
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
            className="text-text-intermidiate min-w-0 flex-1 rounded-2xl bg-surface-secondary px-4 py-2 outline-none button-s"
          />
          <button
            type="submit"
            disabled
            className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-surface-primary-1 opacity-50"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
