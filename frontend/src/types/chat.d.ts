export interface ChatMessage {
  id: string
  content: string
  type: 'user' | 'bot'
  timestamp: Date
}

export interface ChatAction {
  id: string
  label: string
  onClick: () => void
}
