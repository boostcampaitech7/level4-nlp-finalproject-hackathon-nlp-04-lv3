import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ChatbotActionType } from '../types/chat'
import ChatMessage from './ChatMessage'
import { FaPaperPlane } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import useTextChatList from 'hooks/useTextChatList'
import { useChatListStore } from 'stores/chatListStore'
import 'styles/scrollbar.css'
import usePostTextChat from 'hooks/text/usePostTextChat'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { QueryClient } from '@tanstack/react-query'

interface ChatInterfaceProps {
  actions?: ChatbotActionType[]
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
  const [inputValue, setInputValue] = useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { text_id } = useParams()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])

  const { chatList, addNewChat, resetChatList, scrollDir, setScrollDir } =
    useChatListStore()
  // 연쇄적인 refetch를 막기 위한 변수들
  // 최초 대화 내역 로드 여부
  const [firstLoaded, setFirstLoaded] = useState<boolean>(false)
  // 대화 목록 불러 오는 동안 옵저버가 또 감지되는 걸 막기 위한 변수
  const [observerStop, setObserverStop] = useState<boolean>(true)

  const [prevHeight, setPrevHeight] = useState<number>(0)

  const { refetch, isFetching, pageNum, setPageNum } = useTextChatList(textId)
  const { ref: observerRef } = useIntersectionObserver((entry, observer) => {
    if (observerStop) return
    observer.unobserve(entry.target)
    setPrevHeight(chatContainerRef.current?.scrollHeight ?? 0)
    if (!isFetching && pageNum > 0 && firstLoaded) {
      setScrollDir(1)
      refetch()
    }
  })

  useEffect(() => {
    setScrollDir(-1)
    refetch()
    setTimeout(() => {
      setFirstLoaded(true)
    }, 500)
  }, [])

  useEffect(() => {
    setObserverStop(true)
    if (chatContainerRef.current && scrollDir === 1) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight - prevHeight - 50,
        behavior: 'smooth',
      })
    } else if (chatContainerRef.current && scrollDir === -1) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    setTimeout(() => {
      setScrollDir(0)
      setObserverStop(false)
    }, 500)
  }, [chatList])

  const queryClient = new QueryClient()
  useEffect(() => {
    return () => {
      resetChatList()
      setPageNum(0)
      setFirstLoaded(false)
      queryClient.removeQueries({ queryKey: ['textChatList'] })
    }
  }, [])

  const { submitQuestion, isPending } = usePostTextChat(textId)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isPending) {
      setScrollDir(-1)
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

  const handleClickActionButton = (question: string) => {
    setScrollDir(-1)
    addNewChat({
      id: chatList.length,
      text: question,
      focused: '',
      role: 'user',
    })
    setInputValue('')
    submitQuestion(question, '')
  }

  return (
    <div
      className={`flex flex-col rounded-[32px] bg-surface-primary-2 pt-6 shadow-lg ${width} ${height} ${className}`}
    >
      {/* 채팅 메시지 영역 */}
      <div
        key={`message-container-${textId}`}
        ref={chatContainerRef}
        className="custom-scrollbar-large flex-1 space-y-4 overflow-y-auto px-6 pb-6"
      >
        <div ref={observerRef} />
        <div className="h-[15px] w-full" />
        {chatList.map((chat, idx) => {
          return (
            <ChatMessage
              key={`${chat.role}-msg-wrapper-${chat.id}-${idx}`}
              chat={chat}
            />
          )
        })}
      </div>

      {/* 액션 버튼 영역 */}
      {actions.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex flex-wrap justify-end gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleClickActionButton(action.question)}
                className="whitespace-nowrap rounded-[14px] bg-button-secondary-1 px-4 py-2 text-text-secondary transition-colors button-s hover:bg-[#d8d8d8]"
                disabled={isPending}
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
            disabled={isPending}
          />
          <button
            type="submit"
            className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-surface-primary-1 transition-colors hover:bg-[#d8d8d8]"
            disabled={isPending}
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
