import { useState } from 'react'
import IconButton from './IconButton'
import {
  FaMagnifyingGlass,
  FaRegFileWord,
  FaRegCircleUser,
} from 'react-icons/fa6'
import { CgNotes } from 'react-icons/cg'
import { LuBookOpenText } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { useSidebarStore } from '../stores/sidebarStore'
import { useAuthStore } from '../stores/authStore'
import SearchModal from './SearchModal'
import LoginPopup from '../pages/MainPage/GuestMainPage/LoginPopup'
import { getVocabByNumberData } from '../services/getVocabByNumber'
import useLogout from 'hooks/useLogout'

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore()
  const { isSidebarOpen, closeSidebar } = useSidebarStore()
  const navigate = useNavigate()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)

  // 사이드바를 닫고 해당 페이지로 이동하는 함수
  const closeSidebarWithNavigate = (path: string, state?: any) => {
    closeSidebar()
    navigate(path, { state })
  }

  const { refetch: logout } = useLogout()
  const handleLogout = () => {
    closeSidebar()
    logout()
  }

  // 인증이 필요한 작업을 처리하는 래퍼 함수
  const handleAuthenticatedAction = (action: () => void) => {
    if (isAuthenticated) {
      action()
    } else {
      setIsLoginPopupOpen(true)
    }
  }

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-grey-transparent"
          onClick={closeSidebar}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full min-h-[700px] w-[300px] transform flex-col items-center justify-between rounded-l-2xl bg-surface-primary-2 px-[36px] py-[64px] shadow-[-5px_0px_11.300000190734863px_0px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex w-full flex-col items-start gap-[40px]">
          <IconButton
            icon={FaMagnifyingGlass}
            text="검색"
            onClick={() =>
              handleAuthenticatedAction(() => setIsSearchModalOpen(true))
            }
          />
          <IconButton
            icon={LuBookOpenText}
            text="긴 글 학습"
            onClick={() =>
              handleAuthenticatedAction(() =>
                closeSidebarWithNavigate('/text/list'),
              )
            }
          />
          <IconButton
            icon={FaRegFileWord}
            text="단어 학습"
            onClick={() =>
              handleAuthenticatedAction(async () => {
                // 1부터 100 사이의 랜덤한 vocab_id 생성
                const randomVocabId = Math.floor(Math.random() * 10) + 1
                try {
                  // 백엔드에서 단어 데이터를 받아옴
                  const vocabData = await getVocabByNumberData(randomVocabId)
                  // 데이터를 받아온 후 사이드바를 닫고 /vocab/{vocab_id} 페이지로 이동하면서 데이터를 state로 전달
                  closeSidebarWithNavigate(`/vocab/${randomVocabId}`, vocabData)
                } catch (error) {
                  console.error('단어 데이터를 가져오지 못했습니다.', error)
                }
              })
            }
          />
          <IconButton
            icon={CgNotes}
            text="일기"
            onClick={() =>
              handleAuthenticatedAction(() =>
                closeSidebarWithNavigate('/diary/list'),
              )
            }
          />
        </div>
        {isAuthenticated && (
          <IconButton
            icon={FaRegCircleUser}
            text="로그아웃"
            color="red"
            onClick={handleLogout}
          />
        )}
      </div>
      {isSearchModalOpen && (
        <SearchModal onClose={() => setIsSearchModalOpen(false)} />
      )}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
    </>
  )
}

export default Sidebar
