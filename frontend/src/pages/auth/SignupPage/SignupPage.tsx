// SignupPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Button from 'components/Button'
import { ReactComponent as AraboogieImage } from '../../../assets/araboogie100.svg'
import { ChatInterface } from '../../MainPage/GuestChatInterface'
const SignupPage = () => {
  localStorage.removeItem('popupShown');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    passwordMismatch: false,
    missingFields: false,
    usernameLength: false,
    passwordComplexity: false
  })

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Reset username availability when username changes
    if (name === 'username') setIsUsernameAvailable(false)
  }

  const handleDuplicateCheck = () => {
    const usernameRegex = /^.{8,}$/
    if (!usernameRegex.test(formData.username)) {
      setValidationErrors(prev => ({
        ...prev,
        usernameLength: true
      }))
      alert('아이디는 8자 이상이어야 합니다.')
      return
    }
  
    // 유효한 경우에만 중복 확인 진행
    const dummyCheck = formData.username === 'existingUser' ? false : true
    setIsUsernameAvailable(dummyCheck)
    alert(dummyCheck ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')
  }
  

  // SignupPage.tsx 내 validateForm 함수 수정
const validateForm = () => {
  const usernameRegex = /^.{8,}$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  const errors = {
    passwordMismatch: formData.password !== formData.confirmPassword,
    missingFields: !formData.name || !formData.username || !formData.password || !formData.confirmPassword,
    usernameLength: !usernameRegex.test(formData.username),
    passwordComplexity: !passwordRegex.test(formData.password)
  }
  
  setValidationErrors(errors)
  return !Object.values(errors).some(v => v)
}


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!isUsernameAvailable) {
      alert('아이디 중복 확인을 완료해주세요.')
      return
    }

    try {
      // TODO: 백엔드 API 연동 시 아래 코드 사용
      /*const dummyResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          password: formData.password
        })
      })
      const result = await dummyResponse.json()*/
  
      // 임시 더미 성공 처리
      const dummySuccess = {
        status: 200,
        message: "회원가입 성공 (개발용 더미 데이터)"
      }
  
      console.log('회원가입 성공:', dummySuccess)
      
      alert('회원가입 요청이 완료되었습니다! 이해도 설문 페이지로 이동합니다.')
      navigate('/auth/comprehension')
      
    } catch (error) {
      console.error('회원가입 실패:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="h-[calc(100vh-126px)] flex justify-center items-start bg-background-primary pt-20">
      <div className="max-w-6xl w-full px-4">
        <div className="flex gap-10">
          {/* 왼쪽 회원가입 폼 */}
          <div className="flex-1 max-w-[510px]">
            <div className="mb-6">
              <h1 className="text-4xl">
                <span className="text-main text-[35px] font-['PartialSans']">아라부기</span>
                <span className="text-text-intermediate body-l ml-2">와 함께 문해력을 길러보세요!</span>
              </h1>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* 이름 입력 */}
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-20 px-5 rounded-2xl body-s placeholder-[#707070] bg-surface-primary-2"
              />

              {/* 아이디 입력 및 중복 확인 */}
              <div className="flex gap-5">
                <input
                  type="text"
                  name="username"
                  placeholder="아이디"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="flex-1 h-20 px-5 rounded-2xl body-s placeholder-[#707070] bg-surface-primary-2"
                />
                <Button
                  text="중복확인"
                  size="large"
                  color="purple"
                  onClick={handleDuplicateCheck}
                  plusClasses={`body-s px-0 w-[120px] ${!formData.username ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {/* 아이디 유효성 에러 */}
              {validationErrors.usernameLength && (
                <p className="text-red-500 body-s -mt-4">아이디는 8자 이상이어야 합니다.</p>
              )}
              {/* 비밀번호 입력 */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
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

              {/* 비밀번호 확인 */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full h-20 px-5 rounded-2xl body-s placeholder-[#707070] bg-surface-primary-2 pr-16"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>

              {/* 유효성 검사 에러 메시지 */}
                {validationErrors.passwordComplexity && (
                  <p className="text-red-500 body-s">비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다.</p>
                )}

              {/* 회원가입 버튼 */}
              <Button
                text="회원 가입"
                size="large"
                color="purple"
                plusClasses={`body-s ${!isUsernameAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSignup}
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
          <div className="flex-1 relative">
            <div className="absolute left-0 top-0 w-full">
              <h2 className="body-m mb-4">
                글을 읽다 <span className="text-accent-purple">모르는 단어,<br />이해 안 되는 문장</span>을 만났을 때,
              </h2>
              <div className="text-right">
                <span className="text-main text-[30px]  font-['PartialSans']">부기 챗봇</span>
                <span className="text-text-primary body-l">이 여러분을<br />도와드릴게요.</span>
              </div>
            </div>

            <div className="pl-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <AraboogieImage className="absolute -left-[150px] -top-[30px] w-[250px] h-[250px] transform scale-x-[-1]" />
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
                        content: '...',
                        type: 'bot',
                        timestamp: new Date(),
                      }
                    ]}
                    actions={[
                      {
                        id: '1',
                        label: '비슷한 말',
                        onClick: () => {},
                      },
                      {
                        id: '2',
                        label: '반대말',
                        onClick: () => {},
                      },
                      {
                        id: '3',
                        label: '추가 설명',
                        onClick: () => {},
                      }
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