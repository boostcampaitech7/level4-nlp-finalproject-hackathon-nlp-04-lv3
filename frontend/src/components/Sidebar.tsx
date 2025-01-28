import IconButton from './IconButton'
import {
  FaMagnifyingGlass,
  FaRegFileWord,
  FaRegStar,
  FaRegCircleUser,
} from 'react-icons/fa6'
import { CgNotes } from 'react-icons/cg'
import { LuBookOpenText } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { useSidebarStore } from '../stores/sidebarStore'
import useIsAuthenticated from '../hooks/useIsAuthenticated'

const Sidebar = () => {
  const { isAuthenticated } = useIsAuthenticated()
  const { isSidebarOpen, closeSidebar } = useSidebarStore()
  const navigate = useNavigate()

  // 사이드바를 닫고 해당 페이지로 이동하는 함수
  const closeSidebarWithNavigate = (path: string) => {
    closeSidebar()
    navigate(path)
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
            onClick={() => console.log('검색 모달 구현 예정')}
          />
          <IconButton
            icon={LuBookOpenText}
            text="긴 글 학습"
            onClick={() => closeSidebarWithNavigate('/text/list')}
          />
          <IconButton
            icon={FaRegFileWord}
            text="단어 학습"
            onClick={() => {
              const randomVocabId = Math.floor(Math.random() * 100) + 1; // 1부터 100 사이의 랜덤 숫자
              closeSidebarWithNavigate(`/vocab/${randomVocabId}`);
            }}
          />
          <IconButton
            icon={CgNotes}
            text="일기"
            onClick={() => closeSidebarWithNavigate('/diary/list')}
          />
          <IconButton
            icon={FaRegStar}
            text="즐겨찾기"
            onClick={() => closeSidebarWithNavigate('/user/bookmark')}
          />
          <IconButton
            icon={FaRegCircleUser}
            text="마이페이지"
            onClick={() => closeSidebarWithNavigate('/user/profile')}
          />
        </div>
        {isAuthenticated && (
          <IconButton
            icon={FaRegCircleUser}
            text="로그아웃"
            color="red"
            onClick={() => console.log('로그아웃 함수 구현 예정')}
          />
        )}
      </div>
    </>
  )
}

export default Sidebar
