import { FaRegBell, FaBars } from 'react-icons/fa6'
import Button from './Button'

const Header = () => {
  const hadleClick = () => {
    console.info('Button Clicked.')
  }
  const isLogin = true
  const pageName = '긴 글 읽기'

  return (
    <div className="inline-flex justify-between items-center px-[40px] w-full min-w-[1440px] h-[126px] bg-surface-secondary border-b-[3px] border-line select-none">
      <div className="inline-flex items-end gap-[30px]">
        <button className="font-partialSans text-[59px] lett tracking-[-.08em]">
          <span className="text-main">아라</span>
          <span className="text-text-intermediate">부기</span>
        </button>
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
          onClick={hadleClick}
          plusClasses="px-[30px]"
        />
        <button>
          <FaBars size={44} />
        </button>
      </div>
    </div>
  )
}

export default Header
