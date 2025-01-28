import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, ChatAction } from '../types/chat'
import { ChatMessage } from './ChatMessage'
import { FaPaperPlane } from 'react-icons/fa';
import 'styles/scrollbar.css'

interface Message {
  userMessage: string;
  botMessage: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  vocabId?: string;
  messages?: ChatMessageType[];
  actions?: ChatAction[];
  onSendMessage?: (message: string) => void;
  className?: string;
  width?: string;
  height?: string;
  messageSize?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  vocabId,
  messages: propMessages,
  actions = [],
  onSendMessage,
  className = '',
  width = 'w-[400px]',
  height = 'h-[600px]',
  messageSize = 'text-[22px]',
}) => {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [localMessages, propMessages]);

  // 대화 내역 불러오기 (vocabId가 있을 때만)
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!conversationId || !vocabId) return;
      
      try {
        const response = await fetch(`/api/v1/chatbot/conversations/${conversationId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data.messages)) {
          setLocalMessages(data.data.messages);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();
  }, [conversationId, vocabId]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    if (onSendMessage) {
      onSendMessage(message);
      setInputValue('');
      return;
    }

    if (!vocabId) return;
    
    setIsLoading(true);
    const newMessage: Message = {
      userMessage: message,
      botMessage: '',
      timestamp: new Date().toISOString()
    };
    setLocalMessages(prev => [...prev, newMessage]);
    setInputValue('');

    try {
      const response = await fetch('/api/v1/chatbot/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message,
          vocabId,
          conversationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.status === 'success') {
        // 새로운 conversationId가 있다면 저장
        if (data.data.conversationId && !conversationId) {
          setConversationId(data.data.conversationId);
        }

        // 봇의 응답을 메시지 목록에 추가
        setLocalMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage) {
            lastMessage.botMessage = data.data.botMessage;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div
      className={`flex flex-col bg-surface-primary-2 rounded-[32px] shadow-lg ${width} ${height} ${className}`}
    >
      {/* 채팅 메시지 영역 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-4"
      >
        {propMessages ? (
          // 외부에서 주입된 메시지 표시
          propMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              messageSize={messageSize}
              index={index}
            />
          ))
        ) : (
          // 로컬 메시지 표시
          localMessages.map((message, index) => (
            <div key={index} className="space-y-2">
              {message.userMessage && (
                <div className="flex justify-end">
                  <div className="bg-surface-primary-1 rounded-2xl px-4 py-2 max-w-[70%]">
                    {message.userMessage}
                  </div>
                </div>
              )}
              {message.botMessage && (
                <div className="flex justify-start">
                  <div className="bg-surface-secondary rounded-2xl px-4 py-2 max-w-[70%]">
                    {message.botMessage}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-secondary rounded-2xl px-4 py-2">
              입력 중...
            </div>
          </div>
        )}
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
            className="button-s flex-1 min-w-0 py-2 px-4 bg-surface-secondary rounded-2xl text-text-intermidiate outline-none"
          />
          <button
            type="submit"
            className="flex-shrink-0 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-surface-primary-1 hover:bg-[#d8d8d8] transition-colors"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
