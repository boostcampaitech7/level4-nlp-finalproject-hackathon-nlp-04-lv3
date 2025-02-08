import { ChatType } from 'types/chat'

interface ChatMessageProps {
  chat: ChatType
}

const ChatMessage = ({ chat }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] whitespace-pre-line rounded-3xl px-3 py-2 ${
          chat.role === 'user'
            ? 'rounded-tr-none bg-surface-secondary'
            : 'rounded-tl-none bg-background-secondary'
        }`}
      >
        <p className={`text-text-primary button-s`}>{chat.text}</p>
      </div>
    </div>
  )
}

export default ChatMessage
