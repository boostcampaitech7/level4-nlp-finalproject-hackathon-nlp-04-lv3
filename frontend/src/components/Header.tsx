import { FaRegBell, FaBars } from 'react-icons/fa6'
import Button from './Button'
import { Link, useNavigate } from 'react-router'

interface HeaderProps {
  pageName?: string
}

const Header = ({ pageName }: HeaderProps) => {
  // 추후 실제 로그인 상태 확인하는 훅으로 대체할 것
  const isLogin = false
  const navigate = useNavigate()

  const hadleClickUserButton = () => {
    if (isLogin) {
      navigate('/user/profile')
    } else {
      navigate('auth/login')
    }
  }

  const handleClickSidebarButton = () => {
    console.info('사이드 바 구현 예정')
  }

  return (
    <div className="sticky top-0 inline-flex h-[126px] w-full min-w-[1440px] select-none items-center justify-between border-b-[3px] border-line bg-surface-secondary px-[40px]">
      <div className="inline-flex items-end gap-[30px]">
        <Link
          to="/"
          className="lett font-partialSans text-[59px] tracking-[-.08em]"
        >
          <span className="text-main">아라</span>
          <span className="text-text-intermediate">부기</span>
        </Link>
        <div className="headline-l">{pageName}</div>
      </div>
      <div className="inline-flex items-center gap-[40px]">
        {isLogin && (
          <button className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-button-secondary-2 hover:bg-button-secondary-hover">
            <FaRegBell size={33} />
          </button>
        )}
        <Button
          size="medium"
          color="black"
          text={isLogin ? '마이페이지' : '로그인하기'}
          onClick={hadleClickUserButton}
          plusClasses="px-[30px]"
        />
        <button onClick={handleClickSidebarButton}>
          <FaBars size={44} />
        </button>
      </div>
    </div>
  )
}

export default Header
