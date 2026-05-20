import PostActivityLogManagement from "../../../features/content/PostActivityLogManagement";

interface Props {
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;
}
export default function PostApprovalHistory({
  selectedPostId,
  setSelectedPostId,
}: Props) {
  if (!selectedPostId) return null;
  return (
    <div
      className="modal d-block fade show"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header ">
            <h5 className="modal-title m-0">
              Post Approval History
            </h5>
            <button
              type="button"
              className="btn btn-close"
              aria-label="Close"
              onClick={() => setSelectedPostId(null)}
            ></button>
          </div>
          <div className="modal-body">
            <PostActivityLogManagement
            postId= {selectedPostId}
            />
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}
