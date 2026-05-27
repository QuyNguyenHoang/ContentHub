import DeletedPostComponent from "../../../features/content/DeletedPostComponent";

interface Props {
  showDeletedPost: boolean;
  setShowDeletedPost: (value: boolean) => void;
  loadPosts:()=> void;
}
export default function DeletedPost({
  showDeletedPost,
  setShowDeletedPost,
  loadPosts,
}: Props) {
    if(!showDeletedPost) return;
  return (
    <div
      className="modal d-block fade show"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className=" modal-dialog  modal-xl modal-dialog-centered "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title m-0">Deleted Post Management</h5>
            <button
              type="button"
              className="btn btn-close"
              aria-label="Close"
              onClick={() => setShowDeletedPost(false)}
            ></button>
          </div>
          <div
            className="modal-body p-0 "
           
          >
            <DeletedPostComponent loadPosts={loadPosts} />
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}
