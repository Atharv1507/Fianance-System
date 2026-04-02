import './Modal.css'

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} type="button">
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
