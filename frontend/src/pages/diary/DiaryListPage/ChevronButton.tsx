import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useDiaryListPageStore } from 'stores/diaryListPageStore'

interface ChevronButtonProps {
  mode: 'prev' | 'next'
  setPageNum: React.Dispatch<React.SetStateAction<number>>
}

const ChevronButton = ({ mode, setPageNum }: ChevronButtonProps) => {
  const { currentPage, totalPages, setCurrentPage } = useDiaryListPageStore()
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const handleMouseOver = () => {
    setIsHovered(true)
  }

  const handleMouseOut = () => {
    setIsHovered(false)
  }

  const handleClickPage = () => {
    if (mode === 'prev') {
      setCurrentPage(currentPage - 1)
      setPageNum(currentPage - 1)
    } else {
      setCurrentPage(currentPage + 1)
      setPageNum(currentPage + 1)
    }
  }

  const isDisabled = () => {
    if (mode === 'prev' && currentPage === 1) {
      return true
    } else if (mode === 'next' && currentPage === totalPages) {
      return true
    } else {
      return false
    }
  }

  return (
    <button
      className="relative inline-flex h-[44px] w-[44px] items-center leading-none transition-all duration-300 title-s"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClickPage}
      disabled={isDisabled()}
    >
      <div
        key={mode}
        className={`absolute left-1/2 top-1/2 z-0 h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full ${isDisabled() ? 'bg-button-secondary-1' : isHovered ? 'bg-purple-600' : 'bg-purple-700'}`}
      />
      {mode === 'prev' ? (
        <FaChevronLeft
          className={`z-10 flex-1 ${isDisabled() ? 'text-text-secondary' : 'text-purple-200'}`}
        />
      ) : (
        <FaChevronRight
          className={`z-10 flex-1 ${isDisabled() ? 'text-text-secondary' : 'text-purple-200'}`}
        />
      )}
    </button>
  )
}

export default ChevronButton
