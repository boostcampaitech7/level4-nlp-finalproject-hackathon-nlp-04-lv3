import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Button from 'components/Button'
import { ReactComponent as AraboogieImage } from '../../../assets/araboogie100.svg'
import { ChatInterface } from '../../MainPage/GuestMainPage/GuestChatInterface'

const SignupPage = () => {
  // 팝업 제거
  localStorage.removeItem('popupShown');
  const navigate = useNavigate();

  // 비밀번호/비밀번호 확인 보이기 토글
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  // 아이디 중복확인 여부
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
  // 에러 상태
  const [validationErrors, setValidationErrors] = useState({
    passwordMismatch: false,   // 비밀번호 != 비밀번호 확인
    missingFields: false,      // 입력 누락
    usernameFormat: false,     // 아이디 규칙에 부합하는지?
    usernamePasswordSame: false, // 아이디와 비밀번호 같은지?
    passwordComplexity: false, // 비밀번호가 정규식 규칙에 부합하는지?
  })

  // "입력 전까지는 경고문 안 보이게" → 포커스 여부로 제어
  const [hasIDFocused, setHasIDFocused] = useState(false)
  const [hasPasswordFocused, setHasPasswordFocused] = useState(false)
  const [hasConfirmPasswordFocused, setHasConfirmPasswordFocused] = useState(false)

  // 실시간 유효성 검사
  useEffect(() => {
    // 아이디 규칙 (예시) : 여기서는 '8자 이상'만 체크(혹은 A-Za-z0-9 등등)
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{4,12}$/;

    // 아이디와 비밀번호 같은지 확인
    const isUsernamePasswordSame = formData.username === formData.password

    // 비밀번호 복잡도: 영문 + 숫자 + 특수문자(@$!%*#?&) + 공백X + 8~20자
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])(?!.*\s)[A-Za-z\d@$!%*#?&]{8,20}$/

    // 에러 갱신
    setValidationErrors({
      passwordMismatch: formData.password !== formData.confirmPassword,
      missingFields: !formData.name || !formData.username || !formData.password || !formData.confirmPassword,
      usernameFormat: !usernameRegex.test(formData.username),
      usernamePasswordSame: isUsernamePasswordSame,
      passwordComplexity: !passwordRegex.test(formData.password),
    })
  }, [formData])

  // 모든 조건 충족했는지 여부
  const isAllValid =
    !validationErrors.missingFields &&
    !validationErrors.passwordMismatch &&
    !validationErrors.usernameFormat &&
    !validationErrors.usernamePasswordSame &&
    !validationErrors.passwordComplexity &&
    isUsernameAvailable  // 아이디 중복확인까지 마쳐야 함

  // input onChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 아이디 바뀌면 중복확인 상태 초기화
    if (name === 'username') {
      setIsUsernameAvailable(false)
    }
  }

  // 아이디 중복확인 → alert 허용
  const handleDuplicateCheck = () => {
    // 더미 로직: 'existingUser'이면 이미 있는 아이디
    const dummyCheck = formData.username !== 'existingUser'
    setIsUsernameAvailable(dummyCheck)
    alert(dummyCheck ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')
  }

  // 폼 전송
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    // 모든 조건을 이미 useEffect로 검사했으므로 바로 isAllValid 확인
    if (!isAllValid) {
      // alert는 발생시키지 않고, 화면의 빨간 경고문만 보여주도록 함
      return
    }

    // 성공 시 페이지 이동
    navigate('/auth/signup/survey', { state: { signupData: formData } });
  }

  // 비밀번호 표시 토글
  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <div className="min-h-[calc(100vh-126px)] flex justify-center items-start bg-background-primary pt-20 pb-5">
      <div className="max-w-6xl w-full px-4">
        <div className="flex gap-10">
          {/* 왼쪽 회원가입 폼 */}
          <div className="flex-1 max-w-[510px]">
            <div className="mb-6">
              <h1 className="text-4xl">
                <span className="text-main text-[35px] font-['PartialSans']">아라부기</span>
                <span className="text-text-intermediate body-l ml-2">
                  와 함께 문해력을 길러보세요!
                </span>
              </h1>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* 이름 */}
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-20 px-5 rounded-2xl body-s text-text-primary placeholder-[#707070] bg-surface-primary-2"
              />

              {/* 아이디 + 중복확인 */}
              <div className="flex gap-5">
                <input
                  type="text"
                  name="username"
                  placeholder="아이디 (8자 이상)"
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={() => setHasIDFocused(true)}
                  className="flex-1 h-20 px-5 rounded-2xl body-s text-text-primary placeholder-[#707070] bg-surface-primary-2"
                />
                <Button
                  text="중복확인"
                  size="large"
                  color="purple"
                  onClick={handleDuplicateCheck}
                  type="button" // 
                  // 
                  disabled={validationErrors.usernameFormat || !formData.username}
                  plusClasses={`${validationErrors.usernameFormat || !formData.username ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {/* 아이디 에러 (포커스 여부 상관없이 즉시 표시 가능하면 아래처럼)^[A-Za-z0-9]{4,12}$/; */}
              {hasIDFocused && !isUsernameAvailable && validationErrors.usernameFormat && (
                <p className="text-red-500 body-s -mt-4">아이디는 영어+숫자 4~12자를 사용해야 합니다.</p>
              )}

              {/* 비밀번호 */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="비밀번호 (영문+숫자+특수문자, 8~20자)"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setHasPasswordFocused(true)}
                  className="w-full h-20 px-5 rounded-2xl body-s text-text-primary placeholder-[#707070] bg-surface-primary-2 pr-16"
                />
                <button
                  type="button"
                  tabIndex={-1} // 
                  onClick={togglePasswordVisibility}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>
              {hasPasswordFocused && !isUsernameAvailable && validationErrors.usernamePasswordSame && (
                <p className="text-red-500 body-s -mt-4">아이디와 비밀번호가 같을 수 없습니다.</p>
              )}

              {/* 비밀번호 확인 */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setHasConfirmPasswordFocused(true)}
                  className="w-full h-20 px-5 rounded-2xl body-s text-text-primary placeholder-[#707070] bg-surface-primary-2 pr-16"
                />
                <button
                  type="button"
                  tabIndex={-1} // 
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>

              {/* 비밀번호 확인 경고: 포커스한 뒤부터만 표시 */}
              {hasConfirmPasswordFocused && validationErrors.passwordMismatch && (
                <p className="text-red-500 body-s">
                  비밀번호와 비밀번호 확인이 일치하지 않습니다.
                </p>
              )}

              {/* 필수 입력 누락: 여기서는 모든 칸이 비거나 하면 자동으로 표시 */}
              {validationErrors.missingFields && (
                <p className="text-red-500 body-s">모든 칸을 입력해주세요.</p>
              )}

              {/* 모든 조건 충족 + 아이디 중복확인 O */}
              {isAllValid && (
                <p className="text-green-500 body-s">
                  모든 항목이 정상적으로 입력되었습니다!
                </p>
              )}

              {/* 회원가입 버튼 */}
              <Button
                text="회원 가입"
                size="large"
                color="purple"
                onClick={handleSignup}
                plusClasses={`body-s ${
                  !isUsernameAvailable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />

              <p className="mt-8 text-center body-s">
                이미 회원이신가요?{' '}
                <Link to="/auth/login" className="text-[#5e82ff] underline">
                  로그인하기
                </Link>
              </p>
            </form>
          </div>

          {/* 오른쪽 챗봇 섹션 */}
          <div className="flex-1 relative h-[800px]">
            <div className="absolute left-0 top-0 w-full">
              <h2 className="body-m mb-4">
                글을 읽다 <span className="text-accent-purple">모르는 단어,<br/>이해 안 되는 문장</span>을 만났을 때,
              </h2>
              <div className="text-right">
                <span className="text-main text-[30px] font-['PartialSans']">부기 챗봇</span>
                <span className="text-text-primary body-l">
                  이 여러분을<br/>도와드릴게요.
                </span>
              </div>
            </div>
            <div className="pl-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <AraboogieImage
                  className="absolute -left-[150px] -top-[30px] w-[250px] h-[250px] transform scale-x-[-1]"
                />
                <div className="relative left-[-80px] -top-[-165px] transform rotate-[10deg] origin-bottom-right">
                  <ChatInterface
                    messages={[
                      {
                        id: '1',
                        content: '여기서 주인공의 심정이 어떨까?',
                        type: 'user',
                        timestamp: new Date(),
                      },
                      {
                        id: '2',
                        content: '주인공은 희망과 기대감을 느끼고 있을 것 같아요!',
                        type: 'bot',
                        timestamp: new Date(),
                      }
                    ]}
                    actions={[
                      { id: '1', label: '비슷한 말', onClick: () => {} },
                      { id: '2', label: '반대말', onClick: () => {} },
                      { id: '3', label: '추가 설명', onClick: () => {} },
                    ]}
                    onSendMessage={() => {}}
                    width="w-[345px]"
                    height="h-[400px]"
                    messageSize="text-[16px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default SignupPage
