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

// 채팅 메세지 한 건의 타입
export interface ChatType {
  id: number
  text: string
  focused: string
  role: 'user' | 'assistant'
}

// 챗봇 대화내역의 질문-답변 한 쌍
export interface TextChatSetType {
  chatId: number
  focused: string
  question: string
  answer: string
}

// 챗봇 대화내역 조회 시 한 페이지의 데이터 타입
export interface TextChatPageType {
  textId: number
  pageNum: number
  chats: TextChatSetType[]
}

// 챗봇 대화 요청 데이터 타입
export interface TextChatRequestType {
  textId: number
  focused: string
  question: string
  previous: TextChatSetType[]
}
