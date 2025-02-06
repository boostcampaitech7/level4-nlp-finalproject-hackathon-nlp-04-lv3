import { useState } from 'react'
import { useDiaryListPageStore } from 'stores/diaryListPageStore'

interface PageButtonProps {
  pageNumber: number
  setPageNum: React.Dispatch<React.SetStateAction<number>>
}

export const PageButton = ({ pageNumber, setPageNum }: PageButtonProps) => {
  const { currentPage, setCurrentPage } = useDiaryListPageStore()
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const handleMouseOver = () => {
    setIsHovered(true)
  }

  const handleMouseOut = () => {
    setIsHovered(false)
  }

  const handleClickPage = () => {
    setCurrentPage(pageNumber)
    setPageNum(pageNumber)
  }

  return (
    <button
      className="relative inline-flex h-[44px] w-[44px] items-center leading-none transition-all duration-300 title-s"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClickPage}
    >
      <div
        key={pageNumber}
        className={`h-[44px] w-[44px] rounded-full ${pageNumber === currentPage && 'bg-purple-500'} ${isHovered && 'bg-purple-600'} absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2`}
      />
      <div className="z-10 flex-1">{pageNumber}</div>
    </button>
  )
}
