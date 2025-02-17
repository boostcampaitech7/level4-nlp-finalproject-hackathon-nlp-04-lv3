// LoginPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import AraboogieWithBackground from '/assets/araboogie_with_background.svg?react'
import Button from 'components/Button'
// import { useAuthStore } from '../../../stores/authStore'
import useLogin from 'services/login'

const LoginPage = () => {
  // const navigate = useNavigate()
  // const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [error, _] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false) // 체크박스 상태 관리

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const login = useLogin()
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    login({ username: credentials.username, password: credentials.password })
  }

  return (
    <div className="flex min-h-screen min-w-[1440px] items-start justify-center bg-background-primary pt-20">
      <div className="flex w-full max-w-6xl gap-10 px-4">
        {/* 왼쪽 로그인 폼 */}
        <div className="max-w-[510px] flex-1">
          <div className="mb-6">
            <h1 className="text-4xl">
              <span className="font-['PartialSans'] text-[35px] text-main">
                아라부기
              </span>
              <span className="ml-2 text-text-intermediate body-l">
                와 함께 문해력을 길러보세요!
              </span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              name="username"
              placeholder="아이디"
              value={credentials.username}
              onChange={handleInputChange}
              className="h-20 w-full rounded-2xl bg-surface-primary-2 px-5 placeholder-[#707070] body-s"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호"
                value={credentials.password}
                onChange={handleInputChange}
                className="h-20 w-full rounded-2xl bg-surface-primary-2 px-5 pr-16 placeholder-[#707070] body-s"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
              </button>
            </div>

            {error && <p className="text-red-500 body-s">{error}</p>}

            <label className="flex items-center gap-2.5 body-s">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-full border-2"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              로그인 상태 유지하기
            </label>

            <Button
              text="로그인"
              size="large"
              color="purple"
              onClick={handleLogin}
              type="submit"
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
        <div className="max-w-[606px] flex-1">
          <img
            src={AraboogieWithBackground}
            className="h-[786px] w-full rounded-[37px]"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
