import { useState, useEffect, useRef } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import Button from './Button'
import 'styles/scrollbar.css'

interface Message {
  userMessage: string
  botMessage: string
  timestamp: string
}

interface VocabChatInterfaceProps {
  vocabId: string
}

const VocabChatInterface = ({ vocabId }: VocabChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // 대화 내역 불러오기
    const fetchChatHistory = async () => {
      if (!conversationId) return

      try {
        const response = await fetch(
          `/api/v1/chatbot/conversations/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error('Failed to fetch chat history')
        }

        const data = await response.json()
        if (data.status === 'success' && Array.isArray(data.data.messages)) {
          setMessages(data.data.messages)
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      }
    }

    fetchChatHistory()
  }, [conversationId])

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    setIsLoading(true)
    // 즉시 사용자 메시지를 UI에 표시
    const newMessage: Message = {
      userMessage: message,
      botMessage: '',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
    setInputMessage('')

    try {
      const response = await fetch('/api/v1/chatbot/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          userMessage: message,
          vocabId: vocabId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      if (data.status === 'success') {
        setConversationId(data.data.conversationId)
        // 기존 메시지 배열에서 마지막 메시지를 업데이트
        setMessages((prev) => {
          if (prev.length === 0) return prev

          return prev.map((message, index) => {
            if (index === prev.length - 1) {
              return {
                userMessage: message.userMessage,
                botMessage: data.data.botMessage,
                timestamp: message.timestamp,
              }
            }
            return message
          })
        })
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // 에러 발생 시 에러 메시지를 챗봇 응답으로 표시
      setMessages((prev) => {
        if (prev.length === 0) return prev

        return prev.map((message, index) => {
          if (index === prev.length - 1) {
            return {
              userMessage: message.userMessage,
              botMessage: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.',
              timestamp: message.timestamp,
            }
          }
          return message
        })
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonClick = (text: string) => {
    if (!isLoading) {
      sendMessage(text)
    }
  }

  return (
    <div className="inline-flex w-[345px] flex-col items-center justify-center gap-2.5">
      <div className="flex h-[770px] flex-col items-center justify-start overflow-hidden rounded-[32px] border bg-surface-primary-2 pb-[9px] shadow-[0px_0px_8.100000381469727px_5px_rgba(0,0,0,0.05)]">
        <div className="inline-flex h-[770px] w-[345px] flex-col items-center justify-between px-6 py-[17px]">
          {/* Chat history area */}
          <div
            ref={chatContainerRef}
            className="flex h-[600px] flex-col items-center justify-start gap-4 self-stretch overflow-y-auto"
          >
            {messages.map((message, index) => (
              <div key={index} className="w-full space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-button-primary-1 p-3 text-surface-secondary">
                    {message.userMessage}
                  </div>
                </div>
                {(message.botMessage || isLoading) && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl bg-surface-secondary p-3">
                      {message.botMessage || '답변을 생성하고 있습니다...'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat input area */}
          {/* Chat input area */}
          <div className="flex h-[126.95px] w-full flex-col items-center justify-start gap-3 pt-[30px]">
            <div className="flex w-full items-center justify-center gap-2.5">
              {' '}
              {/* inline-flex -> flex + flex-wrap */}
              <Button
                size="small"
                color="grey"
                text="쉽게 설명"
                onClick={() => handleButtonClick('쉽게 설명해주세요')}
                plusClasses="px-[10px] button-s flex-1 min-w-[92px]" // flex-1 + min-width 추가
              />
              <Button
                size="small"
                color="grey"
                text="반대말"
                onClick={() => handleButtonClick('반대말을 알려주세요')}
                plusClasses="px-[10px] button-s flex-1 min-w-[92px]"
              />
              <Button
                size="small"
                color="grey"
                text="추가 설명"
                onClick={() => handleButtonClick('추가 설명해주세요')}
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
