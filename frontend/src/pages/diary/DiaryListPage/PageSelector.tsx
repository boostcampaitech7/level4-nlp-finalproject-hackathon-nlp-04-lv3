import { PageButton } from './PageButton'
import ChevronButton from './ChevronButton'
import { useDiaryListPageStore } from 'stores/diaryListPageStore'

interface PageSelectorProps {
  setPageNum: React.Dispatch<React.SetStateAction<number>>
}

const PageSelector = ({ setPageNum }: PageSelectorProps) => {
  const { currentPage, totalPages } = useDiaryListPageStore()
  const getPageNumbers = (): number[] => {
    // // 전체 페이지가 5 이하라면 그냥 1 ~ totalPages
    // if (totalPages <= 5) {
    //   return Array.from({ length: totalPages }, (_, i) => i + 1)
    // }

    // 현재 페이지가 1~3 사이라면 처음부터 5페이지까지
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5]
    }

    // 현재 페이지가 마지막 3페이지 근처라면 마지막 5페이지를 보여주기
    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    // 그 외(4페이지 ~ totalPages-3)에는 currentPage를 중앙으로 하여 5페이지씩 노출
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ]
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-x-[40px]">
      <ChevronButton mode="prev" setPageNum={setPageNum} />
      {pageNumbers.map((pageNumber) => {
        return (
          <PageButton
            key={pageNumber}
            pageNumber={pageNumber}
            setPageNum={setPageNum}
            disabled={pageNumber > totalPages}
          />
        )
      })}
      <ChevronButton mode="next" setPageNum={setPageNum} />
    </div>
  )
}

export default PageSelector
