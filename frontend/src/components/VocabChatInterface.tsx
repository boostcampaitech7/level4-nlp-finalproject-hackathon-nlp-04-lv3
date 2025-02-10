import { useState, useEffect, useRef, useMemo } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import Button from './Button'
import 'styles/scrollbar.css'
import { useParams } from 'react-router'
import { useChatListStore } from 'stores/chatListStore'
import useVocabChatList from 'hooks/vocab/useVocabChatList'
import ChatMessage from './ChatMessage'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { QueryClient } from '@tanstack/react-query'
import usePostVocabChat from 'hooks/vocab/usePostVocabChat'

const VocabChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { vocab_id } = useParams()
  const vocabId = useMemo(() => {
    const parsedId = parseInt(vocab_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [vocab_id])

  const { chatList, addNewChat, resetChatList } = useChatListStore()
  // 연쇄적인 refetch를 막기 위한 변수들
  // 최초 대화 내역 로드 여부
  const [firstLoaded, setFirstLoaded] = useState<boolean>(false)
  // 이전 대화 내역 로딩 중인지 여부
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [prevHeight, setPrevHeight] = useState<number>(0)
  const [prevPage, setPrevPage] = useState<number>(1)
  const { refetch, isFetching, pageNum, setPageNum } = useVocabChatList(vocabId)
  const { ref: observerRef } = useIntersectionObserver((entry, observer) => {
    observer.unobserve(entry.target)
    setPrevHeight(chatContainerRef.current?.scrollHeight ?? 0)
    if (!isFetching && pageNum > 0 && firstLoaded && !isLoading) {
      setIsLoading(true)
      refetch()
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  })

  useEffect(() => {
    console.log('1')
    refetch()
    setTimeout(() => {
      setFirstLoaded(true)
    }, 500)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current && prevPage < pageNum) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight - prevHeight - 50,
        behavior: 'smooth',
      })
      setPrevPage(pageNum)
    } else if (chatContainerRef.current && pageNum >= 0) {
      console.log(chatContainerRef.current.scrollHeight)
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [chatList])

  const queryClient = new QueryClient()
  useEffect(() => {
    return () => {
      resetChatList()
      setPageNum(0)
      setPrevPage(1)
      queryClient.removeQueries({ queryKey: ['vocabChatList'] })
    }
  }, [])

  const { submitQuestion } = usePostVocabChat(vocabId)
  const sendMessage = async (message: string) => {
    if (!message.trim()) return
    addNewChat({
      id: chatList.length,
      text: message,
      role: 'user',
    })
    setInputMessage('')
    submitQuestion(message)
  }

  const handleButtonClick = (question: string) => {
    addNewChat({
      id: chatList.length,
      text: question,
      role: 'user',
    })
    setInputMessage('')
    submitQuestion(question)
  }

  return (
    <div
      key={`chatbot-${vocabId}`}
      className="inline-flex w-[345px] flex-col items-center justify-center gap-2.5"
    >
      <div className="flex h-[770px] flex-col items-center justify-start overflow-hidden rounded-[32px] border bg-surface-primary-2 pb-[9px] shadow-[0px_0px_8.100000381469727px_5px_rgba(0,0,0,0.05)]">
        <div className="inline-flex h-[770px] w-[345px] flex-col items-center justify-between px-6 py-[17px]">
          {/* Chat history area */}
          <div
            key={`message-container-${vocabId}`}
            ref={chatContainerRef}
            className="custom-scrollbar-small flex-1 space-y-4 overflow-y-auto"
          >
            <div ref={observerRef} />
            {chatList.map((chat, idx) => {
              return (
                <ChatMessage
                  key={`${chat.role}-msg-wrapper-${chat.id}-${idx}`}
                  chat={chat}
                />
              )
            })}
          </div>

          {/* Chat input area */}
          <div className="flex h-[126.95px] w-full flex-col items-center justify-start gap-3 pt-[30px]">
            <div className="flex w-full items-center justify-center gap-2.5">
              {' '}
              {/* inline-flex -> flex + flex-wrap */}
              <Button
                size="small"
                color="grey"
                text="비슷한 말"
                onClick={() => handleButtonClick('이 단어의 유의어를 알려줘.')}
                plusClasses="px-[10px] button-s flex-1 min-w-[92px]" // flex-1 + min-width 추가
              />
              <Button
                size="small"
                color="grey"
                text="반대말"
                onClick={() => handleButtonClick('이 단어의 반의어를 알려줘.')}
                plusClasses="px-[10px] button-s flex-1 min-w-[92px]"
              />
              <Button
                size="small"
                color="grey"
                text="대화 예시"
                onClick={() =>
                  handleButtonClick(
                    '이 단어를 활용해서 일상 생활에서 발생할 수 있는 대화 예시를 만들어줘.',
                  )
                }
                plusClasses="px-[10px] button-s flex-1 min-w-[92px]"
              />
            </div>
            <div className="flex h-[47px] w-full items-start justify-center rounded-2xl bg-surface-secondary p-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!isLoading) {
                    sendMessage(inputMessage)
                  }
                }}
                className="w-full"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="메시지를 입력해 주세요"
                      className="h-8 w-full bg-transparent text-text-secondary outline-none button-s"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-primary-1 transition-colors hover:bg-button-primary-hover-1 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <FaPaperPlane size={16} className="text-text-primary" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VocabChatInterface
