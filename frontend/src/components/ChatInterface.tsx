import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ChatMessage as ChatMessageType, ChatAction } from '../types/chat'
import ChatMessage from './ChatMessage'
import { FaPaperPlane } from 'react-icons/fa'
import 'styles/scrollbar.css'
import { useParams } from 'react-router-dom'
import useTextChatList from 'hooks/useTextChatList'
import { useChatListStore } from 'stores/chatListStore'
import 'styles/scrollbar.css'
import usePostTextChat from 'hooks/text/usePostTextChat'

// interface Message {
//   userMessage: string
//   botMessage: string
//   timestamp: string
// }

interface ChatInterfaceProps {
  type: 'text' | 'vocab'
  vocabId?: string
  messages?: ChatMessageType[]
  actions?: ChatAction[]
  onSendMessage?: (message: string) => void
  className?: string
  width?: string
  height?: string
}

const ChatInterface = ({
  actions = [],
  className = '',
  width = 'w-[400px]',
  height = 'h-[600px]',
}: ChatInterfaceProps) => {
  // const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  // const [conversationId, setConversationId] = useState<string | null>(null)
  // const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { text_id } = useParams()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])

  const useChatList = useTextChatList
  const { chatList, addNewChat } = useChatListStore()

  const { refetch } = useChatList(textId)
  useEffect(() => {
    refetch()
  }, [])

  // 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [chatList])

  // useEffect(() => {
  //   const fetchChatHistory = async () => {
  //     if (!conversationId || !vocabId) return

  //     try {
  //       const response = await fetch(
  //         `/api/v1/chatbot/conversations/${conversationId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         },
  //       )

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch chat history')
  //       }

  //       const data = await response.json()
  //       if (data.status === 'success' && Array.isArray(data.data.messages)) {
  //         setLocalMessages(data.data.messages)
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch chat history:', error)
  //     }
  //   }

  //   fetchChatHistory()
  // }, [conversationId, vocabId])

  // const sendMessage = async (message: string) => {
  //   if (!message.trim()) return

  //   if (onSendMessage) {
  //     onSendMessage(message)
  //     setInputValue('')
  //     return
  //   }

  //   if (!vocabId) return

  //   setIsLoading(true)
  //   const newMessage: Message = {
  //     userMessage: message,
  //     botMessage: '',
  //     timestamp: new Date().toISOString(),
  //   }
  //   setLocalMessages((prev) => [...prev, newMessage])
  //   setInputValue('')

  //   try {
  //     const response = await fetch('/api/v1/chatbot/messages', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //       body: JSON.stringify({
  //         message,
  //         vocabId,
  //         conversationId,
  //       }),
  //     })

  //     if (!response.ok) {
  //       throw new Error('Failed to send message')
  //     }

  //     const data = await response.json()
  //     if (data.status === 'success') {
  //       // 새로운 conversationId가 있다면 저장
  //       if (data.data.conversationId && !conversationId) {
  //         setConversationId(data.data.conversationId)
  //       }

  //       // 봇의 응답을 메시지 목록에 추가
  //       setLocalMessages((prev) => {
  //         const updated = [...prev]
  //         const lastMessage = updated[updated.length - 1]
  //         if (lastMessage) {
  //           lastMessage.botMessage = data.data.botMessage
  //         }
  //         return updated
  //       })
  //     }
  //   } catch (error) {
  //     console.error('Failed to send message:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const { submitQuestion } = usePostTextChat(textId)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue) {
      addNewChat({
        id: chatList.length,
        text: inputValue,
        focused: '',
        role: 'user',
      })
      setInputValue('')
      submitQuestion(inputValue, '')
    }
  }

  return (
    <div
      className={`flex flex-col rounded-[32px] bg-surface-primary-2 pt-6 shadow-lg ${width} ${height} ${className}`}
    >
      {/* 채팅 메시지 영역 */}
      <div
        ref={chatContainerRef}
        className="custom-scrollbar-small flex-1 space-y-4 overflow-y-auto px-6 pb-6"
      >
        {chatList.map((chat, idx) => {
          return (
            <ChatMessage
              key={`${chat.role}-msg-wrapper-${chat.id}-${idx}`}
              chat={chat}
            />
          )
        })}

        {/* {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-surface-secondary px-4 py-2">
              입력 중...
            </div>
          </div>
        )} */}
      </div>

      {/* 액션 버튼 영역 */}
      {actions.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex flex-wrap justify-end gap-2">
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
            placeholder="궁금한 내용을 물어보세요."
            className="text-text-intermidiate min-w-0 flex-1 rounded-2xl bg-surface-secondary px-4 py-2 outline-none button-s"
          />
          <button
            type="submit"
            className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-surface-primary-1 transition-colors hover:bg-[#d8d8d8]"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
