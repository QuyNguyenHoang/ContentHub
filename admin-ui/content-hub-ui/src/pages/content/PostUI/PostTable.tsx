import CIcon from "@coreui/icons-react";
import type { PostResponse } from "../../../api/content/post.api";
import {
  cilFilter,
  cilOptions,
  cilPencil,
  cilShare,
  cilTrash,
} from "@coreui/icons";
import { useRef, useState } from "react";
import useClickOutside from "../../../components/hooks/clickOutSide";

interface Props {
  post: PostResponse[];

  handleToggleSelectPost: (id: string) => void;
  handleToggleSelectAllPost: () => void;
  selectPostIds: string[];
}
export const POST_STATUS = {
  DRAFT: "Draft",
  WAITING_FOR_APPROVAL: "Waiting For Approval",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
} as const;
export const POST_STATUS_OPTIONS = Object.values(POST_STATUS);
export default function PostTable({
  post = [],
  handleToggleSelectAllPost,
  handleToggleSelectPost,
  selectPostIds,
}: Props) {
  const [optionId, setOptionId] = useState<string | null>(null);
  const outSideRef = useRef<HTMLDivElement>(null);
  const [postStatus, setPostStatus] = useState("");
  const handleOption = (postId: string) => {
    setOptionId((prev) => (prev === postId ? null : postId));
  };

  useClickOutside(outSideRef, () => {
    setOptionId(null);
  });
  if (post.length === 0) {
    return <div className="text-center text-black">No post found</div>;
  }
  return (
    <div className="card-body p-0">
      {/* filter areas */}
      <div className="d-flex justify-content-between align-items-center gap-2 pt-3">
        {/* delete button */}

        <div
          className="input-group input-group-sm mb-2"
          style={{ width: "170px" }}
        >
          <span className="input-group-text">
            <CIcon icon={cilFilter} />
          </span>

          <select
            className="form-select"
            onChange={(e) => setPostStatus(e.target.value)}
          >
            <option value="all">All</option>

            {POST_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive overflow-visible">
        <table className="table table-sm table-hover align-middle mb-0 small">
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

              <th>Status</th>

              <th>Tags</th>

              <th>Date Created</th>
              <th>Date Modified</th>
              <th>Is Paid</th>
              <th>Is Deleted</th>
              <th>Author User </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {post.map((p) => {
              const isChecked = selectPostIds.includes(p.id);
              return (
                <tr key={p.id} className="align-middle text-center">
                  <td>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelectPost(p.id)}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.status}</td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      {(p.listTag ?? []).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          {tag.name}
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
                  <td>
                    <div className="d-flex-nowrap justify-content-between">
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
