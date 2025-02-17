import { FaGithub } from 'react-icons/fa6'

const Footer = () => {
  const handleClickGitHub = () => {
    window.open('https://shorturl.at/XIlUM', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex w-full items-center justify-center gap-2.5 bg-button-inverse py-[23px]">
      <div className="inline-flex shrink grow basis-0 flex-col items-center justify-center gap-2.5">
        <div className="self-stretch text-center">
          <span className="font-['PartialSans'] text-[59px] font-normal text-main">
            아라
          </span>
          <span className="font-['PartialSans'] text-[59px] font-normal text-text-secondary">
            부기
          </span>
        </div>
        <div className="self-stretch text-center text-text-inverse body-m">
          <button
            onClick={handleClickGitHub}
            className="duration transform rounded-full p-2 hover:bg-text-secondary hover:text-purple-400"
          >
            <FaGithub size={32} />
          </button>
        </div>
        <div className="self-stretch whitespace-pre-line text-center text-text-inverse caption-s">
          {`2025.01 - 2025.02\nBoostcamp AI Tech 7기\nNLP-04 세븐일레븐`}
        </div>
      </div>
    </div>
  )
}

export default Footer
