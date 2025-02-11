export interface TextDataType {
  text_id: number
  title: string
  category: string
  content: string[]
}

export interface TextCardType {
  textId: number
  title: string
  category: string
}

export interface TextListType {
  pageNum: number
  texts: TextCardType[]
  totalPageCount: number | null
}
