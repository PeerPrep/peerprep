import ReactMarkdown from "react-markdown";
import Button from "../button/Button";

interface PreviewModalProps {
  content: string;
  className?: string;
  isDisabled: boolean;
}

const PreviewModalButton = ({
  content,
  className,
  isDisabled,
}: PreviewModalProps) => {
  const onClickModal = (
    modalId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const closeModal = (
    modalId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    (document.getElementById(modalId) as HTMLFormElement).close();
  };

  return (
    <>
      <Button
        disabled={isDisabled}
        className={`btn btn-accent btn-sm w-24 rounded-full text-white ${className} disabled:bg-slate-600 disabled:text-slate-700`}
        onClick={(e) => onClickModal("preview-modal", e)}
      >
        Preview
      </Button>
      <dialog id="preview-modal" className="modal">
        <div className="modal-box max-w-4xl p-6">
          <button
            onClick={(e) => closeModal("preview-modal", e)}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-1"
          >
            ✕
          </button>
          <ReactMarkdown className="prose mt-2 min-w-[40svh] max-w-none rounded-b-md bg-secondary p-6">
            {content}
          </ReactMarkdown>
        </div>
      </dialog>
    </>
  );
};

export default PreviewModalButton;
