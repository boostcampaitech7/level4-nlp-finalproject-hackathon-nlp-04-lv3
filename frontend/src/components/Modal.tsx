import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText?: string
  onConfirm?: () => void
}

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = '확인',
  onConfirm,
}: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-button-inverse opacity-30"
        onClick={onClose}
      ></div>
      <div className="relative z-50 w-full max-w-md rounded-[32px] bg-surface-primary-2 p-6 shadow-lg">
        <h2 className="mb-4 font-bold body-s">{title}</h2>
        <p className="mb-6 text-text-secondary caption-s">{message}</p>
        <div className="flex justify-end gap-2">
          <Button text="닫기" onClick={onClose} color="grey" size="small" />
          {onConfirm && (
            <Button
              text={confirmText}
              onClick={onConfirm}
              color="purple"
              size="small"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
