import { cilBan, cilCheck, cilHistory } from "@coreui/icons";
import type { PostDetailResponse } from "../../../api/content/post.api";
import CIcon from "@coreui/icons-react";
import { POST_STATUS } from "../../../features/content/PostManagementComponent";

interface Props {
  postDetail: PostDetailResponse | null;
  showPostDetail: string | null;
  setShowPostDetail: (id: string | null) => void;
  handleApprove: (postId: string) => void;
  handleReject: (postId: string) => void;
}
export default function PostDetail({
  postDetail,
  showPostDetail,
  setShowPostDetail,
  handleApprove,
  handleReject,
}: Props) {
  if (!showPostDetail) return null;
  if (!postDetail)
    return (
      <div>
        <h5>Can not found post</h5>
      </div>
    );

  return (
    <>
      <div
        className="modal d-block fade show"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title m-0">Post Detail</h5>
              <button
                className="btn btn-close"
                aria-label="Close"
                title="Close"
                onClick={() => setShowPostDetail(null)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row g-3">
                  {/* LEFT */}
                  <div className="col-12 col-lg-3 h-100">
                    <div className="p-3 border rounded-2 bg-light h-100 overflow-auto">
                      <h6 className="fw-bold mb-3 text-primary">
                        Informations
                      </h6>

                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <td className="text-muted">Name:</td>
                            <td className="fw-semibold">{postDetail.name}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Status:</td>
                            <td>
                              <span className={`badge ${postDetail.status === "Published" ? "bg-success" : "bg-danger"}`}>
                                {postDetail.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Is Paid:</td>
                            <td>
                              <span className="badge bg-warning text-dark">
                                {`${!postDetail.isPaid ? "Free" : "Paid"}`}
                              </span>
                            </td>
                          </tr>

                          <tr>
                            <td className="text-muted">Created:</td>
                            <td className="small">
                              {new Date(postDetail.dateCreated).toLocaleString(
                                "vi-VN",
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Modified:</td>
                            <td>
                              {postDetail.dateModified
                                ? new Date(
                                    postDetail.dateModified,
                                  ).toLocaleString("vi-VN")
                                : "-"}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Description:</td>
                            <td className="small">{postDetail.description}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Source:</td>
                            <td className="small">{postDetail.source}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Tag:</td>

                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {(postDetail.listTag ?? []).map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="badge bg-light text-dark border border-secondary-subtle px-2 py-1 rounded-pill fw-normal"
                                    style={{
                                      maxWidth: "200px",
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    #{tag.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CENTER */}
                  <div className="col-12 col-lg-6 h-100">
                    <div
                      className="p-3 border rounded bg-white overflow-auto"
                      style={{ maxHeight: "75vh" }}
                    >
                      <h6 className="fw-bold text-primary">Content</h6>
                      <div
                        className="container"
                        dangerouslySetInnerHTML={{
                          __html: postDetail.content?.replace(
                            /<img /g,
                            '<img class="img-fluid rounded mx-auto d-block" ',
                          ),
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="col-12 col-lg-3">
                    <div
                      className="p-3 border rounded bg-light"
                      style={{ height: "75vh" }}
                    >
                      <h6 className="text-primary fw-bold">Author</h6>
                      <table className="table-sm table-borderless">
                        <tbody>
                          <tr>
                            <td>
                              <img
                                src={
                                  postDetail.authorAvatar ||
                                  "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775028937/penguin_qkob1d.jpg"
                                }
                                alt="Author"
                                width={32}
                                height={32}
                                className="rounded-circle"
                              />
                            </td>
                            <td className="text-black">
                              {postDetail.authorName}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {postDetail.status !== POST_STATUS.PUBLISHED &&
              postDetail.status !== POST_STATUS.REJECTED ? (
                <>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleApprove(postDetail.id)}
                  >
                    Approve
                    <CIcon
                      icon={cilCheck}
                      size="sm"
                      className="text-success ms-1"
                      title="Approve this post"
                    />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleReject(postDetail.id)}
                  >
                    Reject
                    <CIcon
                      icon={cilBan}
                      size="sm"
                      className="text-danger ms-1"
                      title="Reject this post"
                    />
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm">
                    <CIcon
                      icon={cilHistory}
                      size="sm"
                      title="Approve history"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
