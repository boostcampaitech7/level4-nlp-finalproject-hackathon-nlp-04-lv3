export interface DiaryType {
  diaryId: number
  status: number
  text: string
  feedback: [number, number, string, string][]
  review: string
  createdAt: string
}

export interface SlicedTextType {
  text: string
  withFeedback: boolean
  feedback: string
  modified: string
}

export interface DiaryCardType {
  diaryId: number
  day: string
  status: number
  text: string
}

export interface DiaryListType {
  pageNum: number
  diaries: DiaryCardType[]
  totalPageCount: number | null
}
