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
  const [inputMessage, setInputMessage] = useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null)

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
  const sendMessage = async (message: string) => {
    if (!message.trim()) return
    setScrollDir(-1)
    addNewChat({
      id: chatList.length,
      text: inputMessage,
      focused: '',
      role: 'user',
    })
    setInputMessage('')
    submitQuestion(message, '')
  }

  const handleClickActionButton = (question: string) => {
    setScrollDir(-1)
    addNewChat({
      id: chatList.length,
      text: question,
      focused: '',
      role: 'user',
    })
    setInputMessage('')
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

      <div className="flex w-full flex-col items-center justify-center gap-3 p-4">
        {/* 액션 버튼 영역 */}
        {actions.length > 0 && (
          <div className="flex w-full justify-end gap-2">
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
        )}
        {/* 입력 영역 */}
        <div className="flex h-[47px] w-full items-center justify-center rounded-2xl bg-surface-secondary p-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!isPending) {
                sendMessage(inputMessage)
              }
            }}
            className="w-full"
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="궁금한 내용을 물어보세요"
                  className="h-8 w-full bg-transparent text-text-secondary outline-none button-s"
                  disabled={isPending}
                />
              </div>
              <button
                type="submit"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-primary-1 transition-colors hover:bg-button-primary-hover-1 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              >
                <FaPaperPlane size={16} className="text-text-primary" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
