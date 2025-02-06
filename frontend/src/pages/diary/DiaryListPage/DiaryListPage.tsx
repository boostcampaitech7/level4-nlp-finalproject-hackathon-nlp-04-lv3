import { useEffect } from 'react'
import TitleBar from './TItleBar'
import DiaryCard from './DiaryCard'
import useDiaryList from 'hooks/temp.useDiaryList'
import { useDiaryListPageStore } from 'stores/diaryListPageStore'
import PageSelector from './PageSelector'

const DiaryListPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { data: diaryList, isFetching, refetch, setPageNum } = useDiaryList()
  const { currentPage, totalPages, setTotalPages, resetPages } =
    useDiaryListPageStore()

  useEffect(() => {
    if (diaryList?.totalPageCount && totalPages !== diaryList?.totalPageCount) {
      setTotalPages(diaryList.totalPageCount)
    }
  }, [diaryList, totalPages])

  useEffect(() => {
    if (!!currentPage && currentPage > 0) {
      setPageNum(currentPage)
      refetch()
      window.scrollTo(0, 0)
    }
  }, [currentPage, setPageNum])

  useEffect(() => {
    return () => {
      resetPages()
    }
  }, [])

  const displayDiaryList = () => {
    if (isFetching || !diaryList) {
      return <div>일기 목록을 불러오는 중입니다.</div>
    }

    const getYM = (day: string | undefined) => {
      if (!day) return ''
      const date = new Date(day)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      return `${year}년 ${month}월`
    }

    let prevYM = ''
    const diaryCards = diaryList?.diarys.map((diary) => {
      const currentYM = getYM(diary.day)

      if (prevYM != currentYM) {
        prevYM = currentYM
        return (
          <>
            <div
              key={`diary-split-${currentYM}`}
              className="mb-[10px] min-w-[960px] max-w-[1024px] border-b-2 border-line text-start text-text-primary title-s"
            >
              {currentYM}
            </div>
            <DiaryCard key={`diary-${diary.diaryId}`} diary={diary} />
          </>
        )
      } else {
        return <DiaryCard key={`diary-${diary.diaryId}`} diary={diary} />
      }
    })

    return diaryCards
  }

  return (
    <div
      key={`page-${currentPage}`}
      className="flex min-h-[1024px] min-w-[1440px] justify-center bg-background-primary pb-[48px] pt-[24px]"
    >
      <div className="flex w-4/5 flex-col gap-y-[20px]">
        <TitleBar />
        <div className="mb-[20px] flex flex-col items-center gap-y-[16px]">
          {displayDiaryList()}
        </div>
        <PageSelector setPageNum={setPageNum} />
      </div>
    </div>
  )
}

export default DiaryListPage
