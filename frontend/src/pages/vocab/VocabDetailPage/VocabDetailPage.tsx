import Button from 'components/Button'

const VocabDetailPage = () => {
  function handleButtonClick(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-5">
        <div className="h-[917px] px-[138px] py-5 justify-start items-start gap-[19px] inline-flex">
          <div className="flex-col justify-center items-center gap-5 inline-flex">
            <div className="self-stretch h-[742px] flex-col justify-start items-start gap-4 flex">
              <div className="w-[800px] justify-start items-start gap-5 inline-flex">
                <div className="w-[390px] h-[363px] px-[50px] py-[30px] bg-surface-secondary rounded-[32px] shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] flex-col justify-start items-start inline-flex">
                  <div className="w-[303px] h-[60px] justify-end items-start inline-flex">
                    <div className="w-[60px] h-[60px] relative" />
                  </div>
                  <div className="self-stretch h-[76px] flex-col justify-start items-start gap-2.5 flex">
                    <div className="px-2.5 justify-center items-end gap-2.5 inline-flex">
                      <div className="text-[#202020] text-[64px] font-black font-['Pretendard']">
                        독실한
                      </div>
                      <div className="h-[38px] py-[7px]" />
                    </div>
                  </div>
                  <div className="self-stretch grow shrink basis-0 px-2.5 justify-center items-center gap-2.5 inline-flex">
                    <div className="grow shrink basis-0 self-stretch text-[#707070] text-2xl font-medium font-['Pretendard']">
                      믿음이 두텁고 성실하다.{' '}
                    </div>
                  </div>
                </div>
                <div className="w-[390px] h-[363px] bg-surface-secondary-1 rounded-[32px] border-4 border-[#e8e8e8] overflow-hidden">
                  {/* 카드 내용 */}
                  <div className="w-full h-full flex flex-col">
                    <div className="px-8 pt-6 pb-4">
                      <h3 className="self-stretch text-[#202020] text-[28px] font-semibold font-['Pretendard']">
                        쉬운 설명
                      </h3>
                      {/* <h3 className="text-[28px] font-semibold text-[#202020]">옳은 사용</h3> */}
                    </div>
                    <div className="relative z-10 flex flex-col items-start px-8 w-full">
                      <div className="self-stretch text-[#202020] text-[20px] font-normal font-['Pretendard'] tracking-tight">
                        어떤 믿음이나 신념을 매우 깊고 진지하게 믿고 따르는 것을
                        뜻해요 주로 종교를 열심히 믿는 사람을 말할 때 많이
                        사용하지만, 꼭 종교가 아니어도 어떤 생각이나 가치를
                        진심으로 지키는 사람에게도 쓸 수 있어요.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[800px] justify-start items-start gap-5 inline-flex">
                <div className="flex-col justify-start items-start inline-flex">
                  <div className="w-[390px] h-[363px] bg-surface-secondary-1 rounded-[32px] border-4 border-[#e8e8e8] overflow-hidden">
                    {/* 카드 내용 */}
                    <div className="w-full h-full flex flex-col">
                      {/* 제목 */}
                      <div className="px-8 pt-6 pb-4">
                        <h3 className="text-[28px] font-semibold text-[#202020]">
                          옳은 사용
                        </h3>
                      </div>

                      {/* O 마크와 예문 */}
                      <div className="flex-1 flex items-center justify-center relative">
                        {/* 배경 O */}
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                          <div className="text-[270px] font-bold font-['Pretendard'] text-[#426cff]/10">
                            O
                          </div>
                        </div>

                        {/* 예문 */}
                        <div className="relative z-10 flex flex-col items-start px-8 w-full">
                          <p className="text-2xl text-[#202020] font-medium">
                            그는 매일 새벽마다 교회에 나가 기도하는 독실한
                            신자였다.
                          </p>
                        </div>
                      </div>

                      {/* 하단 버튼들 */}
                      <div className="px-8 pb-6 flex justify-end gap-2 z-10">
                        <Button
                          size="small"
                          color="grey"
                          text={'쉽게'}
                          onClick={handleButtonClick}
                          plusClasses="px=[10px]"
                        />
                        <Button
                          size="small"
                          color="grey"
                          text={'어렵게'}
                          onClick={handleButtonClick}
                          plusClasses="px=[10px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-start items-start inline-flex">
                  <div className="w-[390px] h-[363px]  rounded-[32px] border-4 border-[#e8e8e8] overflow-hidden">
                    {/* 카드 내용 */}
                    <div className="w-full h-full flex flex-col">
                      {/* 제목 */}
                      <div className="px-8 pt-6">
                        <h3 className="text-[28px] font-semibold text-[#202020]">
                          틀린 사용
                        </h3>
                      </div>

                      {/* X 마크와 예문 */}
                      <div className="flex-1 relative flex items-center justify-center -mt-6">
                        {/* 배경 X */}
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                          <div className="text-[#ff4646]/10 text-[270px] font-bold font-['Pretendard'] -mt-4">
                            X
                          </div>
                        </div>

                        {/* 예문 */}
                        <div className="relative z-10 flex flex-col items-start px-8 w-full">
                          <p className="text-2xl text-[#202020] font-medium">
                            그는 독실한 운동 실력으로 대회에서 우승했다.
                          </p>
                          <p className="text-[#707070] text-xl font-normal mt-2">
                            "독실한"은 실력에 쓰이지 않음
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-start items-center gap-[22px] inline-flex">
              <Button
                size="medium"
                color="purple"
                text={'이전 단어'}
                onClick={handleButtonClick}
                plusClasses="px=[10px]"
                showBackIcon={true}
              />
              <Button
                size="medium"
                color="purple"
                text={'퀴즈 풀기'}
                onClick={handleButtonClick}
                plusClasses="px=[10px]"
              />
              <Button
                size="medium"
                color="purple"
                text={'다음 단어'}
                onClick={handleButtonClick}
                plusClasses="px=[10px]"
                showFrontIcon={true}
              />
            </div>
          </div>
          <div className="w-[345px] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="h-[802px] pb-[9px] bg-surface-secondary-1 rounded-[32px] shadow-[0px_0px_8.100000381469727px_5px_rgba(0,0,0,0.25)] border flex-col justify-start items-center flex overflow-hidden">
              <div className="w-[345px] h-[793px] px-6 py-[17px] flex-col justify-between items-center inline-flex">
                <div className="self-stretch h-[257px] flex-col justify-center items-center gap-6 flex overflow-hidden">
                  <div className="self-stretch h-[257px] flex-col justify-center items-center gap-6 flex">
                    <div className="self-stretch h-[50px]" />
                    <div className="self-stretch h-[42.50px]" />
                    <div className="self-stretch h-[50px]" />
                    <div className="self-stretch h-[42.50px]" />
                  </div>
                </div>
                <div className="self-stretch h-[126.95px] pt-[30px] flex-col justify-start items-center gap-3 flex">
                  <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
                    <div className="grow shrink basis-0 h-[37.95px] px-[8.95px] py-[4.48px] bg-button-secondary-1 rounded-[14.32px] justify-center items-center gap-[2.69px] flex">
                      <div className="grow shrink basis-0 text-center text-text-secondary button-s">
                        쉽게 설명
                      </div>
                    </div>
                    <div className="grow shrink basis-0 h-[37.95px] px-[8.95px] py-[4.48px] bg-button-secondary-1 rounded-[14.32px] justify-center items-center gap-[2.69px] flex">
                      <div className="grow shrink basis-0 text-center text-text-secondary button-s">
                        반대말
                      </div>
                    </div>
                    <div className="grow shrink basis-0 h-[37.95px] px-[8.95px] py-[4.48px] bg-button-secondary-1 rounded-[14.32px] justify-center items-center gap-[2.69px] flex">
                      <div className="grow shrink basis-0 text-center text-text-secondary button-s">
                        추가 설명
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-[47px] p-2.5 bg-[#f2f2f2] rounded-2xl flex-col justify-center items-start flex">
                    <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                      <div className="grow shrink basis-0 self-stretch text-[#707070] text-base font-medium font-['Pretendard']">
                        메시지를 입력해 주세요
                      </div>
                      <div className="w-[30px] h-[27px] justify-center items-center flex">
                        <div className="w-8 h-8 px-[5px] bg-[#a680ff] rounded-[20px] justify-end items-center gap-2.5 inline-flex">
                          <div className="w-[18px] h-[18px] relative  overflow-hidden" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-start items-center inline-flex">
              <div className="w-[35px] h-[35px] px-[11px] py-0.5 bg-white/80 rounded-[17.50px] border-2 border-[#707070] flex-col justify-center items-center gap-2.5 inline-flex">
                <div className="text-center text-[#707070] text-2xl font-medium font-['Pretendard'] leading-[31.20px] tracking-tight">
                  ?
                </div>
              </div>
              <div className="p-2.5 justify-center items-center gap-2.5 flex">
                <div className="text-[#707070] text-xl font-normal font-['Pretendard']">
                  현재 페이지의 사용법 알아보기
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VocabDetailPage
