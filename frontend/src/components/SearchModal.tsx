// SearchModal.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { useSidebarStore } from '../stores/sidebarStore' 
import { getVocabData } from 'services/mainPage'

// 실제 API 호출 함수 대신 더미 함수를 사용합니다.
// 실제 환경에서는 API 호출 로직으로 대체하세요.


interface SearchModalProps {
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { closeSidebar } = useSidebarStore()

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      const data = await getVocabData(searchTerm)
      // 검색 성공 후 모달 닫고, 단어 상세 페이지로 이동
      onClose()
      closeSidebar()
      navigate(`/vocab/${data.vocab_id}`, { state: { vocabData: data } })
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 어두운 오버레이: 클릭 시 모달 닫기 */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />

      {/* 모달 내용 */}
      <div className="relative z-10">
        <div className="w-[655px] h-[78px] px-7 py-2.5 bg-[#f2f2f2] rounded-[32px] shadow-[0px_0px_13.2px_0px_rgba(178,148,250,1)] flex items-center gap-[22px]">
          {/* 아이콘 영역 */}
          <div className="w-[36.27px] h-[37px] flex items-center justify-center">
            <FaMagnifyingGlass size={30} className="text-[#707070]" />
          </div>
          {/* 검색 입력 */}
          <input
            type="text"
            placeholder="검색할 단어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="flex-1 text-text-intermidiate body-l bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchModal
