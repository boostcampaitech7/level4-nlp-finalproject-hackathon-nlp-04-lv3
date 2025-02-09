export interface VocabDetailType {
  vocab_id: number
  vocab: string
  hanja: string[]
  dict_mean: string
  easy_explain: string
  correct_example: string[]
  incorrect_example: string[]
}

export type CardType =
  | 'definition'
  | 'explanation'
  | 'correct'
  | 'incorrect'
  | 'correctTutorial'
  | 'incorrectTutorial'
