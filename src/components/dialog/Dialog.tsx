import { DIALOG_PROP } from "../../common/types";
import "./Dialog.scss";

const Dialog = ({ open, onClose, header, footer, content }: DIALOG_PROP) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <div className="modal">
          <p className="closeBtn" onClick={onClose}>
            X
          </p>
          <header>{header}</header>
          <div className="content">{content}</div>
          <footer>{footer}</footer>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
