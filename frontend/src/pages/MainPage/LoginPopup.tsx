import React from 'react';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLogin = () => {
    // 로그인 처리 로직
    console.log('로그인 처리');
  };

  const handleSignup = () => {
    // 회원가입 처리 로직
    console.log('회원가입 처리');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="w-[708px] h-[190px] bg-[color:var(--color-surface-secondary)] rounded-[32px] flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="headline-s text-[color:var(--color-text-primary)]">
              로그인이 필요한 서비스입니다
            </div>
          </div>
          <div className="h-[90px] border-t border-[color:var(--color-text-primary)] flex">
            <div 
              className="flex-1 border-r border-[color:var(--color-text-primary)] flex items-center justify-center transition-colors duration-200 hover:bg-black/5 group cursor-pointer"
              onClick={handleLogin}
            >
              <div className="body-m text-[color:var(--color-text-tertiary)] transition-all duration-200] group-hover:scale-105">
                로그인하기
              </div>
            </div>
            <div 
              className="flex-1 flex items-center justify-center transition-colors duration-200 hover:bg-black/5 group cursor-pointer"
              onClick={handleSignup}
            >
              <div className="body-m text-[color:var(--color-text-tertiary)] transition-all duration-200] group-hover:scale-105">
                회원가입하러 가기
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
