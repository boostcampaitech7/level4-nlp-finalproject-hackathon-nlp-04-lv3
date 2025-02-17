import { useNavigate } from 'react-router-dom'

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

const LoginPopup = ({ isOpen, onClose }: LoginPopupProps) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleLogin = () => {
    navigate('/auth/login')
    onClose()
  }

  const handleSignup = () => {
    navigate('/auth/signup')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="flex h-[190px] w-[708px] items-center justify-center rounded-[32px] bg-surface-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-1 items-center justify-center">
            <div className="text-text-primary headline-s">
              로그인이 필요한 서비스입니다
            </div>
          </div>
          <div className="flex h-[90px] border-t border-text-primary">
            <div
              className="group flex flex-1 cursor-pointer items-center justify-center border-r border-text-primary transition-colors duration-200 hover:bg-black/5"
              onClick={handleLogin}
            >
              <div className="duration-200] text-text-tertiary transition-all body-m group-hover:scale-105">
                로그인하기
              </div>
            </div>
            <div
              className="group flex flex-1 cursor-pointer items-center justify-center transition-colors duration-200 hover:bg-black/5"
              onClick={handleSignup}
            >
              <div className="duration-200] text-text-tertiary transition-all body-m group-hover:scale-105">
                회원가입하러 가기
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPopup
