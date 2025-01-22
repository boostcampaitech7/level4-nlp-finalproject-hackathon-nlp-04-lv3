import { FaRegBell, FaBars } from 'react-icons/fa6'
import Button from './Button'
import { Link, useNavigate } from 'react-router'
import { isAuthenticated } from '../App'

interface HeaderProps {
  pageName?: string
}

const Header = ({ pageName }: HeaderProps) => {
  const isLogin = isAuthenticated()
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
    <div className="inline-flex justify-between items-center px-[40px] w-full min-w-[1440px] h-[126px] bg-surface-secondary border-b-[3px] border-line select-none">
      <div className="inline-flex items-end gap-[30px]">
        <Link
          to="/"
          className="font-partialSans text-[59px] lett tracking-[-.08em]"
        >
          <span className="text-main">아라</span>
          <span className="text-text-intermediate">부기</span>
        </Link>
        <div className="headline-l">{pageName}</div>
      </div>
      <div className="inline-flex items-center gap-[40px]">
        {isLogin && (
          <button className="inline-flex justify-center items-center rounded-full bg-button-secondary-2 w-[60px] h-[60px] hover:bg-button-secondary-hover">
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
