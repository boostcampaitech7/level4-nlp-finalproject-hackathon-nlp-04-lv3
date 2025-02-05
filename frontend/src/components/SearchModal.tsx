// SearchModal.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { useSidebarStore } from '../stores/sidebarStore' 

// 실제 API 호출 함수 대신 더미 함수를 사용합니다.
// 실제 환경에서는 API 호출 로직으로 대체하세요.
const fetchVocabData = async (vocab: string) => {
//   return new Promise<{ vocab_id: number }>((resolve, reject) => {
//     setTimeout(() => {
//       // 예시: 임의의 vocab_id를 반환
//       resolve({ vocab_id: Math.floor(Math.random() * 100) + 1 })
//     }, 500)
//   })
return {
    vocab_id: 12345678,
    vocab: vocab,
    hanja: "",
    dict_mean: "신의, 믿음, 관계, 인정 따위가 굳고 깊다.",
    easy_explain: "감정이나 연결이 아주 깊고 단단하다는 뜻이에요. 쉽게 말해, 친구나 가족과의 믿음이나 관계가 매우 굳고 가까운 상태를 말해요.",
    correct_example: [
      "그는 친구들과의 신뢰가 두터워 어떤 어려운 상황에서도 도움을 주고받았다.",
      "그들의 가족 간의 사랑은 세월이 흘러도 여전히 두텁다.",
      "두터운 우정을 쌓아 온 친구들이라 서로의 약점을 이해하고 감싸주었다.",
      "회사 내에서 동료들과의 신뢰가 두텁기 때문에 중요한 프로젝트를 맡을 수 있었다.",
      "선생님은 제자들과 두터운 정을 나누며 오랜 시간 가르침을 이어갔다."
    ],
    incorrect_example: [
      "그는 두터운 목소리로 노래를 불렀다.",
      "\"두텁다\"는 목소리와 같은 물리적 특성에는 쓰이지 않음."
    ]
  };
}

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
      const data = await fetchVocabData(searchTerm)
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
