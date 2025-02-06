import { TextListType } from 'types/textList'

const getTextList = (pageNum: number) => {
  const dummyTextList: TextListType = {
    pageNum: pageNum,
    texts: Array.from({ length: 16 }, (_, i) => ({
      textId: (pageNum - 1) * 16 + i + 1,
      title: pageNum % 2 === 0 ? '어린왕자' : '연금술사',
      category: '소설',
    })),
    totalPageCount: pageNum === 1 ? 7 : null,
  }

  setTimeout(() => {
    console.log(`GET text list, ${pageNum}페이지`)
  }, 1200)

  return dummyTextList
}

export default getTextList
