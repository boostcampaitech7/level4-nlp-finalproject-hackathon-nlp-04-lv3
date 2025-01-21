import IconButton from './IconButton'
import {
  FaMagnifyingGlass,
  FaRegFileWord,
  FaRegStar,
  FaRegCircleUser,
} from 'react-icons/fa6'
import { LuBookOpenText } from 'react-icons/lu'
import { CgNotes } from 'react-icons/cg'
import { useNavigate } from 'react-router'

const Sidebar = () => {
  const isOpen = true
  const navigate = useNavigate()

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-grey-transparent" />}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full min-h-[700px] w-[300px] transform flex-col items-center justify-between rounded-l-2xl bg-surface-primary-2 px-[36px] py-[64px] shadow-[-5px_0px_11.300000190734863px_0px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
            onClick={() => navigate('/text/list')}
          />
          <IconButton
            icon={FaRegFileWord}
            text="단어 학습"
            onClick={() => navigate('/vocab/list')}
          />
          <IconButton
            icon={CgNotes}
            text="일기"
            onClick={() => navigate('/diary/list')}
          />
          <IconButton
            icon={FaRegStar}
            text="즐겨찾기"
            onClick={() => navigate('/user/bookmark')}
          />
          <IconButton
            icon={FaRegCircleUser}
            text="마이페이지"
            onClick={() => navigate('/user/profile')}
          />
        </div>
        <IconButton
          icon={FaRegCircleUser}
          text="로그아웃"
          color="red"
          onClick={() => console.log('로그아웃 함수 구현 예정')}
        />
      </div>
    </>
  )
}

export default Sidebar
