const Footer = () => {
  return (
    <div className="w-full py-[23px] bg-button-inverse justify-center items-center gap-2.5 inline-flex">
      <div className="grow shrink basis-0 flex-col justify-center items-center gap-2.5 inline-flex">
        <div className="self-stretch text-center">
          <span className="text-main text-[59px] font-normal font-['PartialSans']">
            아라
          </span>
          <span className="text-text-secondary text-[59px] font-normal font-['PartialSans']">
            부기
          </span>
        </div>
        <div className="self-stretch text-center text-text-inverse body-m">
          GitHub: https://shorturl.at/XIlUM
        </div>
        <div className="self-stretch text-center text-text-inverse body-m">
          2024.08-2025.02
        </div>
      </div>
    </div>
  )
}

export default Footer
