import CIcon from "@coreui/icons-react";
import type { PostResponse } from "../../../api/content/post.api";
import {
  cilBan,
  cilCheck,
  cilHistory,
  cilOptions,
  cilPencil,
  cilShare,
  cilTrash,
} from "@coreui/icons";
import { useRef, useState } from "react";
import useClickOutside from "../../../components/hooks/ClickOutside";
import PostApprovalHistory from "./PostApprovalHistory";
import { POST_STATUS } from "../../../features/content/PostManagementComponent";

interface Props {
  post: PostResponse[];

  handleToggleSelectPost: (id: string) => void;
  handleToggleSelectAllPost: () => void;
  handleApprove: (postId: string) => void;
  handleReject: (postId: string) => void;
  selectPostIds: string[];
  setShowPostDetail:(id:string | null) => void;
}

export default function PostTable({
  post = [],
  handleToggleSelectAllPost,
  handleToggleSelectPost,
  handleApprove,
  handleReject,
  selectPostIds,
  setShowPostDetail
}: Props) {
  const [optionId, setOptionId] = useState<string | null>(null);
  const outSideRef = useRef<HTMLDivElement>(null);

  //open post approval history
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const handleOption = (postId: string) => {
    setOptionId((prev) => (prev === postId ? null : postId));
  };

  useClickOutside(outSideRef, () => {
    setOptionId(null);
  });
  return (
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle mb-0 small "style={{ minWidth: "1200px" }}>
          <thead className="table-light text-center">
            <tr className="text-sm">
              <th>
                <input
                  type="checkbox"
                  checked={
                    post.length > 0 && selectPostIds.length === post.length
                  }
                  onChange={handleToggleSelectAllPost}
                />
              </th>
              <th>Name</th>
              <th>Author User </th>

              <th>Tags</th>

              <th>Date Created</th>
              <th>Date Modified</th>
              <th>Is Paid</th>
              <th>Is Deleted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {post.map((p) => {
              const isChecked = selectPostIds.includes(p.id);
              return (
                <tr
                  key={p.id}
                  className="align-middle text-center"
                  onDoubleClick={() => setShowPostDetail(p.id)}
                  style={{cursor:"pointer"}}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelectPost(p.id)}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>
                    <div className="d-flex flex-nowrap justify-content-between">
                      <img
                        src={
                          p.authorAvatar ||
                          "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775028937/penguin_qkob1d.jpg"
                        }
                        alt="Author avatar"
                        width={24}
                        height={24}
                        className="rounded-circle me-2"
                      />
                      <span>{p.authorName}</span>
                    </div>
                  </td>

                  <td>
                    <div
                      className="flex gap-2 flex-wrap"
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nomal",
                        wordBreak: "break-word",
                      }}
                    >
                      {(p.listTag ?? []).map((tag) => (
                        <span
                          key={`${tag.id}-${tag.name}`}
                          className="badge bg-light text-dark border border-secondary-subtle  px-2 py-1  rounded-pill fw-normal"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{new Date(p.dateCreated).toLocaleString("vi-VN")}</td>
                  <td>
                    {p.dateModified
                      ? new Date(p.dateModified).toLocaleString("vi-VN")
                      : "-"}
                  </td>
                  <td>
                    {p.isPaid ? (
                      <span className="text-success">Paid</span>
                    ) : (
                      <span className="fw-bold">Free</span>
                    )}
                  </td>
                  <td>
                    {p.isDeleted ? (
                      <span className="text-danger">Deleted</span>
                    ) : (
                      <span className="text-success">Active</span>
                    )}
                  </td>
                  <td
                    className={`fw-bold ${p.status !== POST_STATUS.PUBLISHED ? "text-danger" : "text-success"}`}
                  >
                    {p.status}
                  </td>
                  <td className="text-center">
                    <div className="dropdown position-relative">
                      <button
                        className="btn btn-sm"
                        onClick={() => handleOption(p.id)}
                      >
                        <CIcon
                          icon={cilOptions}
                          size="sm"
                          title="Detail this post"
                        />
                      </button>

                      {optionId === p.id && (
                        <ul className="dropdown-menu show position-absolute end-0 mt-1">
                          <li>
                            <button className="dropdown-item d-flex align-items-center">
                              <CIcon
                                icon={cilPencil}
                                size="sm"
                                className="me-2"
                              />
                              Edit
                            </button>
                          </li>

                          <li>
                            <button className="dropdown-item d-flex align-items-center text-danger">
                              <CIcon
                                icon={cilTrash}
                                size="sm"
                                className="me-2"
                              />
                              Delete
                            </button>
                          </li>

                          <li>
                            <button className="dropdown-item d-flex align-items-center">
                              <CIcon
                                icon={cilShare}
                                size="sm"
                                className="me-2"
                              />
                              Share
                            </button>
                          </li>
                        </ul>
                      )}
                      {p.status !== POST_STATUS.PUBLISHED &&
                      p.status !== POST_STATUS.REJECTED ? (
                        <>
                          <button
                            className="btn btn-sm "
                            onClick={() => handleApprove(p.id)}
                          >
                            <CIcon
                              icon={cilCheck}
                              size="sm"
                              className="text-success"
                              title="Approve this post"
                            />
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleReject(p.id)}
                          >
                            <CIcon
                              icon={cilBan}
                              size="sm"
                              className="text-danger"
                              title="Reject this post"
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm"
                            onClick={() => setSelectedPostId(p.id)}
                          >
                            <CIcon
                              icon={cilHistory}
                              size="sm"
                              title="Approve history"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Post Approval History */}
      <PostApprovalHistory
        selectedPostId={selectedPostId}
        setSelectedPostId={setSelectedPostId}
      />
    </div>
  );
}
