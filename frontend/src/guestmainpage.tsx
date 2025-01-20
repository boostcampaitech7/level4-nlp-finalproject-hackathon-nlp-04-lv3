import React from 'react';

const GuestMainPage: React.FC = () => {
  return (
    <div className="flex justify-start items-start flex-row gap-2.5 bg-[#C9B3FF]">
      <div
        className="flex justify-start items-center flex-col gap-[103px] w-[1440px] relative"
        style={{ width: '1440px' }}
      >
        {/* 상단 헤더 영역 */}
        <div className="flex self-stretch justify-end items-center flex-col">
          <div
            className="flex justify-center items-end flex-row border-solid border-[#D4D4D4] border-b-[3px] w-[1440px] h-[126px] relative"
            style={{ width: '1440px' }}
          >
            <div
              className="flex justify-start items-center flex-row gap-[689px] py-4 pr-[139px] pl-[47px] bg-[#F2F2F2] absolute w-[1440px] relative"
              style={{
                top: '0px',
                height: '124px',
                left: 'calc(100% - 1440px + 0px)',
                width: '1440px',
              }}
            >
              <div className="flex flex-1 justify-start items-end flex-row gap-[30px]">
                <div className="text-[59px] font-['Partial_Sans_KR'] text-center tracking-[-4.72px]">
                  <span className="text-[#8B59FF]">아라</span>
                  <span className="text-[#3E3E3E]">부기</span>
                </div>
                <div
                  className="flex justify-start items-center flex-row gap-2.5 py-3.5 w-[80px]"
                  style={{ width: '80px' }}
                />
              </div>
              <div className="flex justify-center items-center flex-row">
                <div className="flex justify-end items-center flex-row gap-2.5">
                  <div
                    className="flex justify-start items-center flex-row gap-[6.6666669845581055px] w-[40px]"
                    style={{ width: '40px' }}
                  />
                  <div className="min-w-[90px] flex justify-center items-center flex-row gap-[3px] py-[5px] px-2.5 bg-[#000000] rounded-[20px] h-[64px]">
                    <p className="text-[#FFFFFF] text-3xl font-['Pretendard'] text-center font-medium">
                      로그인하기
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="absolute"
                style={{ right: '40px', width: '70px', top: '30px', height: '70px' }}
              >
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 70 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6409 10.1133C11.2447 10.1133 10.1128 11.2452 10.1128 12.6414V14.8084C10.1128 16.2047 11.2447 17.3365 12.6409 17.3365H58.1475C59.5437 17.3365 60.6756 16.2047 60.6756 14.8084V12.6414C60.6756 11.2452 59.5437 10.1133 58.1475 10.1133H12.6409ZM12.6409 28.352C11.2447 28.352 10.1128 29.4839 10.1128 30.8802V33.0471C10.1128 34.4434 11.2447 35.5753 12.6409 35.5753H58.1475C59.5437 35.5753 60.6756 34.4434 60.6756 33.0471V30.8802C60.6756 29.4839 59.5437 28.352 58.1475 28.352H12.6409ZM12.6409 46.5908C11.2447 46.5908 10.1128 47.7226 10.1128 49.1189V51.2859C10.1128 52.6821 11.2447 53.814 12.6409 53.814H58.1475C59.5437 53.814 60.6756 52.6821 60.6756 51.2859V49.1189C60.6756 47.7226 59.5437 46.5908 58.1475 46.5908H12.6409Z"
                    fill="#707070"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 여백용 div (absolute) */}
        <div
          className="absolute"
          style={{ left: '917px', width: '513px', top: '122px', height: '487px' }}
        />

        {/* 메인 소개 섹션 */}
        <div
          className="flex justify-start items-center flex-col gap-[85px] w-[1080px]"
          style={{ width: '1080px' }}
        >
          {/* 첫 번째 블록 */}
          <div className="flex self-stretch justify-start items-center flex-col gap-[89px]">
            <div
              className="flex justify-start items-center flex-col gap-[53px] w-[906px]"
              style={{ width: '906px' }}
            >
              <p className="self-stretch text-[64px] font-['Pretendard'] text-center font-black">
                <span className="text-[#8B59FF]">아라부기</span>
                <span className="text-[#202020]">
                  와 함께 <br />
                  더 깊이 이해하고 더 넓게 소통하세요.
                </span>
              </p>
            </div>
            <div className="flex self-stretch justify-center items-center flex-row gap-2.5 px-2.5 h-[178px]">
              {/* 카드 1 */}
              <div className="flex flex-1 self-stretch justify-start items-start flex-col">
                <div className="flex self-stretch flex-1 justify-between items-start flex-col gap-[50px] p-3.5 bg-[#FFFFFF] rounded-[28px]">
                  <p className="self-stretch text-[#202020] text-2xl font-['Pretendard'] font-medium leading-[1.19]">
                    ‘사랑’과 ‘애정’은 느낌이 어떻게 다를까?
                  </p>
                  <div className="flex self-stretch justify-end items-end flex-col gap-6 h-[147px]">
                    <div className="flex self-stretch justify-end items-center flex-row gap-3 h-[36px]">
                      <div className="min-w-[90px] flex justify-center items-center flex-row gap-[3px] py-[5px] px-2.5 bg-[#E8E8E8] rounded-2xl">
                        <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                          {' '}
                        </p>
                        <p className="flex-1 text-[#707070] text-2xl font-['Pretendard'] text-center font-semibold">
                          알아보기
                        </p>
                        <svg
                          width="23"
                          height="22"
                          viewBox="0 0 23 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.0583 11.6965L8.70757 19.6676C8.30482 20.052 7.65187 20.052 7.24917 19.6676L6.27519 18.7379C5.87314 18.3541 5.87236 17.7321 6.27348 17.3474L12.8916 11.0004L6.27348 4.65342C5.87236 4.26874 5.87314 3.64674 6.27519 3.26295L7.24917 2.33325C7.65191 1.94881 8.30487 1.94881 8.70757 2.33325L17.0582 10.3044C17.461 10.6887 17.461 11.312 17.0583 11.6965Z"
                            fill="#707070"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 카드 2 */}
              <div className="flex flex-1 self-stretch justify-start items-start flex-col">
                <div className="flex self-stretch flex-1 justify-between items-end flex-col gap-[50px] p-3.5 bg-[#FFFFFF] rounded-[28px]">
                  <p className="self-stretch text-[#202020] text-2xl font-['Pretendard'] font-medium leading-[1.19]">
                    ‘고구마’는 어떻게 생긴 말일까? 한자어일까, 고유어일까, 아니면 외국어에서
                    왔을까?
                  </p>
                  <div className="flex self-stretch justify-end items-end flex-col gap-6 h-[147px]">
                    <div className="flex self-stretch justify-end items-center flex-row gap-3 h-[36px]">
                      <div className="min-w-[90px] flex justify-center items-center flex-row gap-[3px] py-[5px] px-2.5 bg-[#E8E8E8] rounded-2xl">
                        <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                          {' '}
                        </p>
                        <p className="flex-1 text-[#707070] text-2xl font-['Pretendard'] text-center font-semibold">
                          알아보기
                        </p>
                        <svg
                          width="23"
                          height="22"
                          viewBox="0 0 23 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.7248 11.6965L8.37407 19.6676C7.97133 20.052 7.31837 20.052 6.91567 19.6676L5.9417 18.7379C5.53964 18.3541 5.53887 17.7321 5.93998 17.3474L12.5581 11.0004L5.93998 4.65342C5.53887 4.26874 5.53964 3.64674 5.9417 3.26295L6.91567 2.33325C7.31842 1.94881 7.97137 1.94881 8.37407 2.33325L16.7248 10.3044C17.1275 10.6887 17.1275 11.312 16.7248 11.6965Z"
                            fill="#707070"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 카드 3 */}
              <div className="flex flex-1 self-stretch justify-start items-start flex-col">
                <div className="flex self-stretch flex-1 justify-between items-end flex-col gap-[50px] p-3.5 bg-[#FFFFFF] rounded-[28px]">
                  <p className="self-stretch text-[#202020] text-2xl font-['Pretendard'] font-medium leading-[1.19]">
                    ‘엉겁결’이라는 말, 왜 그렇게 쓰일까?
                  </p>
                  <div className="flex self-stretch justify-end items-end flex-col gap-6 h-[147px]">
                    <div className="flex self-stretch justify-end items-center flex-row gap-3 h-[36px]">
                      <div className="min-w-[90px] flex justify-center items-center flex-row gap-[3px] py-[5px] px-2.5 bg-[#E8E8E8] rounded-2xl">
                        <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                          {' '}
                        </p>
                        <p className="flex-1 text-[#707070] text-2xl font-['Pretendard'] text-center font-semibold">
                          알아보기
                        </p>
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3918 11.6965L8.04107 19.6676C7.63832 20.052 6.98537 20.052 6.58266 19.6676L5.60869 18.7379C5.20663 18.3541 5.20586 17.7321 5.60697 17.3474L12.2251 11.0004L5.60697 4.65342C5.20586 4.26874 5.20663 3.64674 5.60869 3.26295L6.58266 2.33325C6.98541 1.94881 7.63836 1.94881 8.04107 2.33325L16.3917 10.3044C16.7945 10.6887 16.7945 11.312 16.3918 11.6965Z"
                            fill="#707070"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 추천 글 섹션 */}
          <div
            className="flex justify-start items-start flex-col gap-6 w-[1069px]"
            style={{ width: '1069px' }}
          >
            <div className="self-stretch text-[#202020] text-[32px] font-['Pretendard'] font-semibold">
              📖 OOO님이 관심 있어 할 만한 글이에요!
            </div>
            <div className="flex self-stretch justify-start items-start flex-row gap-[60px] p-2.5">
              {/* 추천 카드 1 */}
              <div className="flex flex-1 justify-start items-start flex-col gap-[26px] py-[30px] px-[31px] bg-[#F1EBFF] rounded-[28px] h-[601px]">
                <div className="self-stretch text-[#202020]">
                  <span className="text-[32px] font-['Pretendard'] font-semibold">말의 품격&nbsp;&nbsp;</span>
                  <span className="text-2xl font-['Pretendard'] font-medium">이기주</span>
                </div>
                <div className="flex self-stretch flex-1 justify-start items-start flex-col gap-[120px]">
                  <p className="self-stretch text-2xl font-['Pretendard'] font-medium">
                    지금 우리는 ‘말의 힘’이 세상을 지배하는 시대에 살고 있다. 온당한 말 한마디가
                    천 냥 빚만 갚는 게 아니라 사람의 인생을, 나아가 조직과 공동체의 명운을
                    바꿔놓기도 한다. 말하기가 개인의 경쟁력을 평가하는 잣대가 된 지도 오래다.
                    말 잘하는 사람을 매력 있는 사람으로 간주하는 풍토는 갈수록 확산하고 있다.
                    그래서인지 날카로운 혀를 빼 들어 칼처럼 휘두르는 사람은 넘쳐나고, 자극적인
                    이야기를 폭포수처럼 쏟아내며 좌중을 들었다 놨다 하는 능변가는 홍수처럼
                    범람한다.
                  </p>
                  <div className="flex self-stretch justify-end items-center flex-row gap-3 h-[36px]">
                    <div className="min-w-[90px] flex justify-center items-center flex-row gap-[3px] py-[5px] px-2.5 bg-[#C9B3FF] rounded-2xl">
                      <p className="text-[#000000] text-2xl font-['Pretendard'] text-center font-semibold border-solid border-[#FFFFFF] border">
                        {' '}
                      </p>
                      <p className="flex-1 text-[#FFFFFF] text-2xl font-['Pretendard'] text-center font-semibold">
                        읽으러 가기
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 추천 카드 2 */}
              <div className="flex flex-1 justify-start items-start flex-col gap-[26px] py-[30px] px-[31px] bg-[#F1EBFF] rounded-[28px] h-[601px]">
                <div className="self-stretch text-[#202020]">
                  <span className="text-[32px] font-['Pretendard'] font-semibold">고요의 힘&nbsp;&nbsp;</span>
                  <span className="text-2xl font-['Pretendard'] font-medium">틱낫한</span>
                </div>
                <div className="flex self-stretch flex-1 justify-start items-start flex-col gap-1">
                  <p className="self-stretch text-2xl font-['Pretendard'] font-medium">
                    우리의 머릿속은 늘 생각으로 가득 차 있다. 그래서 다른 사람들의 이야기를 들을
                    공간조차 없다. 우리가 타인과 더 많이 연결되고자 한다면 그들의 이야기를
                    경청해야 한다. 진심으로 귀 기울여 듣는다는 것은 이해하는 것이고, 그것을
                    위해서는 우리가 “내면의 NSTNon-Stop Thinking 라디오”를 꺼야 한다고
                    조언하고 있다. 독자들은 이 책을 통해 틱낫한 스님이 설명하는 내면의 고독과
                    마음챙김의 가장 근원적 해법인 일상 수행의 다양하고 쉬운 방법을 직접
                    체험할 수 있을 것이다.
                    <br />
                    <br />* 출처 : 예스24 &lt;https://www.yes24.com/Product/Goods/140020129&gt;
                  </p>
                  <div className="flex self-stretch justify-end items-center flex-row gap-3 h-[36px]">
                    <div className="min-w-[90px] flex justify-center items-center flex-row gap-[3px] py-[5px] px-2.5 bg-[#C9B3FF] rounded-2xl">
                      <p className="text-[#000000] text-2xl font-['Pretendard'] text-center font-semibold border-solid border-[#FFFFFF] border">
                        {' '}
                      </p>
                      <p className="flex-1 text-[#FFFFFF] text-2xl font-['Pretendard'] text-center font-semibold">
                        읽으러 가기
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 중간 섹션 */}
          <div
            className="flex justify-center items-center flex-row gap-[58px] py-[50px] w-[1014px]"
            style={{ width: '1014px' }}
          >
            <p className="flex-1 text-[52px] font-['Pretendard'] font-bold">
              <span className="text-[#202020]">나에게 맞는 <br /></span>
              <span className="text-[#8B59FF]">매일 </span>
              <span className="text-[#202020]">
                새로운 <br />
                맞춤 학습
              </span>
            </p>
            <div
              className="w-[670px] h-[510px] relative"
              style={{ width: '670px' }}
            >
              {/* 카드 예시들 (회전) */}
              <div
                className="flex justify-start items-start flex-col py-[30px] px-[50px] bg-[#FFFFFF] rounded-[32px] shadow-[_0px_0px_13.199999809265137px_0px_#B294FA] absolute"
                style={{
                  top: '-32.37%',
                  bottom: '61.21%',
                  height: 'calc(100% - -32.37% - 61.21%)',
                  left: '75.31%',
                  right: '-33.44%',
                  width: 'calc(100% - 75.31% - -33.44%)',
                  transform: 'rotate(9.05deg)',
                }}
              >
                <div className="flex justify-end items-start flex-row w-[303px] h-[60px]" style={{ width: '303px' }} />
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-center items-end flex-row gap-2.5 px-2.5">
                    <span className="text-[#202020] text-[64px] font-['Pretendard'] font-black">input</span>
                    <div
                      className="flex justify-start items-center flex-row gap-2.5 py-[7px] w-[24px]"
                      style={{ width: '24px' }}
                    />
                  </div>
                </div>
                <div className="flex self-stretch flex-1 justify-center items-center flex-row gap-2.5 px-2.5">
                  <div className="flex-1 self-stretch text-[#707070] text-2xl font-['Pretendard'] font-medium">
                    input caption
                  </div>
                </div>
              </div>

              <div
                className="flex justify-start items-start flex-col py-[30px] px-[50px] bg-[#FFFFFF] rounded-[32px] shadow-[_0px_0px_13.199999809265137px_0px_#B294FA] absolute"
                style={{
                  top: '62.97%',
                  bottom: '-34.13%',
                  height: 'calc(100% - 62.97% - -34.13%)',
                  left: '111.34%',
                  right: '-69.47%',
                  width: 'calc(100% - 111.34% - -69.47%)',
                  transform: 'rotate(-30.21deg)',
                }}
              >
                <div className="flex justify-end items-start flex-row w-[303px] h-[60px]" style={{ width: '303px' }} />
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-center items-end flex-row gap-2.5 px-2.5">
                    <span className="text-[#202020] text-[64px] font-['Pretendard'] font-black">input</span>
                    <div
                      className="flex justify-start items-center flex-row gap-2.5 py-[7px] w-[24px]"
                      style={{ width: '24px' }}
                    />
                  </div>
                </div>
                <div className="flex self-stretch flex-1 justify-center items-center flex-row gap-2.5 px-2.5">
                  <div className="flex-1 self-stretch text-[#707070] text-2xl font-['Pretendard'] font-medium">
                    input caption
                  </div>
                </div>
              </div>

              <div
                className="flex justify-start items-start flex-col py-[30px] px-[50px] bg-[#FFFFFF] rounded-[32px] shadow-[_0px_0px_13.199999809265137px_0px_#B294FA] absolute"
                style={{
                  top: '42.42%',
                  bottom: '-13.58%',
                  height: 'calc(100% - 42.42% - -13.58%)',
                  left: '157.52%',
                  right: '-115.64%',
                  width: 'calc(100% - 157.52% - -115.64%)',
                  transform: 'rotate(48.6deg)',
                }}
              >
                <div className="flex justify-end items-start flex-row w-[303px] h-[60px]" style={{ width: '303px' }} />
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-center items-end flex-row gap-2.5 px-2.5">
                    <span className="text-[#202020] text-[64px] font-['Pretendard'] font-black">가온누리</span>
                    <div
                      className="flex justify-start items-center flex-row gap-2.5 py-[7px] w-[24px]"
                      style={{ width: '24px' }}
                    />
                  </div>
                </div>
                <div className="flex self-stretch flex-1 justify-center items-center flex-row gap-2.5 px-2.5">
                  <div className="flex-1 self-stretch text-[#707070] text-2xl font-['Pretendard'] font-medium">
                    어떠한 일이 있어도 세상의 중심
                  </div>
                </div>
              </div>

              <div
                className="flex justify-start items-start flex-col py-[30px] px-[50px] bg-[#FFFFFF] rounded-[32px] shadow-[_0px_0px_13.199999809265137px_0px_#B294FA] absolute"
                style={{
                  top: '2.65%',
                  bottom: '26.19%',
                  height: 'calc(100% - 2.65% - 26.19%)',
                  left: '107.24%',
                  right: '-65.37%',
                  width: 'calc(100% - 107.24% - -65.37%)',
                  transform: 'rotate(-20.84deg)',
                }}
              >
                <div className="flex justify-end items-start flex-row w-[303px] h-[60px]" style={{ width: '303px' }} />
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-center items-end flex-row gap-2.5 px-2.5">
                    <span className="text-[#202020] text-[64px] font-['Pretendard'] font-black">input</span>
                    <div
                      className="flex justify-start items-center flex-row gap-2.5 py-[7px] w-[24px]"
                      style={{ width: '24px' }}
                    />
                  </div>
                </div>
                <div className="flex self-stretch flex-1 justify-center items-center flex-row gap-2.5 px-2.5">
                  <div className="flex-1 self-stretch text-[#707070] text-2xl font-['Pretendard'] font-medium">
                    input caption
                  </div>
                </div>
              </div>

              <div
                className="flex justify-start items-start flex-col py-[30px] px-[50px] bg-[#FFFFFF] rounded-[32px] shadow-[_0px_0px_13.199999809265137px_0px_#B294FA] absolute"
                style={{
                  top: '-40.11%',
                  bottom: '68.95%',
                  height: 'calc(100% - -40.11% - 68.95%)',
                  left: '100.21%',
                  right: '-58.34%',
                  width: 'calc(100% - 100.21% - -58.34%)',
                  transform: 'rotate(23.45deg)',
                }}
              >
                <div className="flex justify-end items-start flex-row w-[303px] h-[60px]" style={{ width: '303px' }} />
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-center items-end flex-row gap-2.5 px-2.5">
                    <span className="text-[#202020] text-[64px] font-['Pretendard'] font-black">input</span>
                    <div
                      className="flex justify-start items-center flex-row gap-2.5 py-[7px] w-[24px]"
                      style={{ width: '24px' }}
                    />
                  </div>
                </div>
                <div className="flex self-stretch flex-1 justify-center items-center flex-row gap-2.5 px-2.5">
                  <div className="flex-1 self-stretch text-[#707070] text-2xl font-['Pretendard'] font-medium">
                    input caption
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 예시 섹션 */}
          <div
            className="flex justify-center items-center flex-row gap-2.5 py-[23px] bg-[#202020] w-[1444px]"
            style={{ width: '1444px' }}
          >
            <div className="flex flex-1 justify-center items-center flex-col gap-2.5">
              <p className="self-stretch text-[59px] font-['Partial_Sans_KR'] text-center tracking-[-4.72px]">
                <span className="text-[#8B59FF]">아라</span>
                <span className="text-[#707070]">부기</span>
              </p>
              <p className="self-stretch text-[#FFFFFF] text-2xl font-['Pretendard'] text-center font-medium">
                GitHub: https://shorturl.at/XIlUM
              </p>
              <p className="self-stretch text-[#FFFFFF] text-2xl font-['Pretendard'] text-center font-medium">
                2024.08-2025.02
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 예시 대화창 */}
      <div
        className="flex justify-center items-center flex-row gap-x-[158px] w-[1014px] h-[802px]"
        style={{ width: '1014px' }}
      >
        <div className="flex justify-center items-center flex-col pb-[9px] bg-[#FFFFFF] border-solid border rounded-[32px] shadow-[_0px_0px_8.100000381469727px_5px_rgba(0,0,0,0.25)]">
          <div className="flex justify-between items-center flex-col gap-2.5 py-[17px] px-[24px]">
            <div className="flex self-stretch justify-center items-center flex-col gap-6">
              <div className="flex self-stretch justify-center items-center flex-col gap-6">
                <div className="flex self-stretch justify-start items-end flex-col gap-2.5">
                  <div className="flex justify-start items-start flex-row gap-2.5 py-3 px-[24px] bg-[#F2F2F2] rounded-tl-3xl rounded-br-3xl rounded-bl-3xl">
                    <p className="min-w-[48px] text-[#202020] text-[22px] font-['Pretendard']">
                      여기서 주인공의 심정이 어떨까?
                    </p>
                  </div>
                </div>
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-start items-start flex-row gap-2.5 py-3 px-[24px] bg-[#F1EBFF] rounded-tr-3xl rounded-br-3xl rounded-bl-3xl" />
                </div>
                <div className="flex self-stretch justify-start items-end flex-col gap-2.5">
                  <div className="flex justify-start items-start flex-row gap-2.5 py-3 px-[24px] bg-[#F2F2F2] rounded-tl-3xl rounded-br-3xl rounded-bl-3xl">
                    <p className="min-w-[48px] text-[#202020] text-[22px] font-['Pretendard']">
                      이 문장에서 ‘희망’은 어떤 의미로 쓰였을까?
                    </p>
                  </div>
                </div>
                <div className="flex self-stretch justify-start items-start flex-col gap-2.5">
                  <div className="flex justify-start items-start flex-row gap-2.5 py-3 px-[24px] bg-[#F1EBFF] rounded-tr-3xl rounded-br-3xl rounded-bl-3xl" />
                </div>
              </div>
            </div>
            <div className="flex self-stretch justify-start items-center flex-col gap-3 pt-[30px]">
              <div className="flex self-stretch justify-center items-center flex-row gap-2.5">
                <div className="flex flex-1 justify-center items-center flex-row gap-[2.685314655303955px] py-[4.475524425506592px] px-[8.951048851013184px] bg-[#E8E8E8] rounded-[14.321678161621094px]">
                  <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                    {' '}
                  </p>
                  <p className="flex-1 text-[#707070] font-['Pretendard'] text-center font-medium">
                    비슷한 말
                  </p>
                  <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                    {' '}
                  </p>
                </div>
                <div className="flex flex-1 justify-center items-center flex-row gap-[2.685314655303955px] py-[4.475524425506592px] px-[8.951048851013184px] bg-[#E8E8E8] rounded-[14.321678161621094px]">
                  <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                    {' '}
                  </p>
                  <p className="flex-1 text-[#707070] font-['Pretendard'] text-center font-medium">
                    반대말
                  </p>
                  <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                    {' '}
                  </p>
                </div>
                <div className="flex flex-1 justify-center items-center flex-row gap-[2.685314655303955px] py-[4.475524425506592px] px-[8.951048851013184px] bg-[#E8E8E8] rounded-[14.321678161621094px]">
                  <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                    {' '}
                  </p>
                  <p className="flex-1 text-[#707070] font-['Pretendard'] text-center font-medium">
                    추가 설명
                  </p>
                  <p className="text-[#202020] text-2xl font-['Pretendard'] text-center font-semibold">
                    {' '}
                  </p>
                </div>
              </div>
              <div className="max-h-[150px] flex self-stretch justify-center items-start flex-col p-2.5 bg-[#F2F2F2] rounded-2xl">
                <div className="flex self-stretch justify-start items-end flex-row gap-2.5">
                  <div className="flex-1 self-stretch text-[#707070] font-['Pretendard'] font-medium leading-[22px]">
                    메시지를 입력해 주세요
                  </div>
                  <div
                    className="flex justify-center items-center flex-row w-[30px] h-[27px]"
                    style={{ width: '30px' }}
                  >
                    <div className="flex justify-end items-center flex-row gap-2.5 px-[5px] bg-[#C9B3FF] rounded-[20px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[52px] font-['Pretendard'] text-right font-bold">
          <span className="text-[#202020]">읽다가</span>
          <span className="text-[#8B59FF]"> 막히면? <br /></span>
          <span className="text-[#202020]">
            아라부기가 <br />
            친절하게 풀어드립니다
          </span>
        </p>
      </div>
    </div>
  );
};

export default GuestMainPage;
