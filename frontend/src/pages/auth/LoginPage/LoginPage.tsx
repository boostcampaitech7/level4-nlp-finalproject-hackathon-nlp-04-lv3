// LoginPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { ReactComponent as AraboogieWithBackground } from '../../../assets/araboogie_with_background.svg'
import Button from 'components/Button'
import { useAuthStore } from '../../../stores/authStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 더미 로그인 검증
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setIsAuthenticated(true)
      navigate('/')
    } else {
      setError('잘못된 아이디 또는 비밀번호입니다')
    }
  }

  return (
    <div className="h-[calc(100vh-126px)] flex justify-center items-start bg-background-primary pt-20">
      <div className="flex gap-10 max-w-6xl w-full px-4">
        {/* 왼쪽 로그인 폼 */}
        <div className="flex-1 max-w-[510px]">
          <div className="mb-6">
            <h1 className="text-4xl">
              <span className="text-main text-[35px] font-['PartialSans']">아라부기</span>
              <span className="text-text-intermediate body-l ml-2">와 함께 문해력을 길러보세요!</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              name="username"
              placeholder="아이디"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full h-20 px-5 rounded-2xl body-s placeholder-[#707070] bg-surface-primary-2"
            />
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full h-20 px-5 rounded-2xl body-s placeholder-[#707070] bg-surface-primary-2 pr-16"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
              </button>
            </div>

            {error && <p className="text-red-500 body-s">{error}</p>}

            <label className="flex items-center gap-2.5 body-s">
              <input type="checkbox" className="w-6 h-6 rounded-full border-2" />
              로그인 상태 유지하기
            </label>

            <Button
              text="로그인"
              size="large"
              color="purple"
              onClick={handleLogin}
            />

            <p className="mt-8 text-center body-s">
              아직 회원이 아니신가요?{' '}
              <Link to="/auth/signup" className="text-[#5e82ff] underline">
                회원 가입하기
              </Link>
            </p>
          </form>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="flex-1 max-w-[606px]">
          <AraboogieWithBackground className="w-full h-[786px] rounded-[37px]" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage