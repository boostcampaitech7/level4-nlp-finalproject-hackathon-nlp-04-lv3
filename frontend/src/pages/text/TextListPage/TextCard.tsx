import { useNavigate } from 'react-router'
import { TextCardType } from 'types/textList'

const TextCard = ({ textId, title, category }: TextCardType) => {
  const navigate = useNavigate()

  const handleClickCard = () => {
    navigate(`/text/${textId}`)
  }
  return (
    <button
      className="flex min-h-[137px] min-w-[265px] flex-col gap-y-[10px] rounded-[32px] bg-surface-primary-2 px-[20px] py-[17px] transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_17.899999618530273px_0px_rgba(178,148,250,1.00)]"
      onClick={handleClickCard}
    >
      <div className="text-text-primary title-m">{title}</div>
      <div className="text-text-secondary body-m">{category}</div>
    </button>
  )
}

export default TextCard
