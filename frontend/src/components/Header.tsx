import { FaRegBell, FaBars } from 'react-icons/fa6'
import Button from './Button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSidebarStore } from '../stores/sidebarStore'
import useIsAuthenticated from '../hooks/useIsAuthenticated'
import { useMemo } from 'react'

const Header = () => {
  const { openSidebar } = useSidebarStore()
  const navigate = useNavigate()
  const { isAuthenticated } = useIsAuthenticated()
  const location = useLocation()

  const pageName = useMemo(() => {
    if (location.pathname.includes('/vocab')) {
      return '단어 학습'
    } else if (location.pathname.includes('/text')) {
      return '긴 글 학습'
    }
    return ''
  }, [location.pathname])

  const handleClickUserButton = () => {
    if (isAuthenticated) {
      navigate('/user/profile')
    } else {
      navigate('auth/login')
    }
  }

  const handleClickSidebarButton = () => {
    openSidebar()
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
        {isAuthenticated && (
          <button className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-button-secondary-2 hover:bg-button-secondary-hover">
            <FaRegBell size={33} />
          </button>
        )}
        <Button
          size="medium"
          color="black"
          text={isAuthenticated ? '마이페이지' : '로그인하기'}
          onClick={handleClickUserButton}
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
