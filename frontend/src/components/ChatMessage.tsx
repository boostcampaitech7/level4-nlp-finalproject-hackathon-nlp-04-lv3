import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { useScrollTriggerAnimation } from '../hooks/useScrollTriggerAnimation';

interface ChatMessageProps {
  message: ChatMessageType;
  messageSize: string;
  index: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, messageSize }) => {
  const messageRef = useScrollTriggerAnimation(message.id);

  return (
    <div
      ref={messageRef}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`px-6 py-3 rounded-3xl max-w-[80%] ${
          message.type === 'user'
            ? 'bg-[#f0eaff] rounded-tr-none'
            : 'bg-[#f2f2f2] rounded-tl-none'
        }`}
      >
        <p className={`text-[#202020] ${messageSize} font-normal font-['Pretendard']`}>
          {message.content}
        </p>
      </div>
    </div>
  );
};
