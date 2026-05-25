import CIcon from "@coreui/icons-react";
import type { PostResponse } from "../../../api/content/post.api";
import { cilReload } from "@coreui/icons";

interface Props {
  deletedPost: PostResponse[];
  selectedIds: string[];
  handleRestore: (ids: string[]) => void;
  handleSelected: (id: string) => void;
  handleToggleSelected: () => void;
}
export default function DeletedPostTable({
  deletedPost,
  selectedIds,
  handleRestore,
  handleSelected,
  handleToggleSelected,
}: Props) {
  return (
    <div className="card-body p-0">
      <div className="table-responsive overflow-visible">
        <table className="table table-sm table-hover align-middle mb-0 small">
          <thead className="table-light text-center">
            <tr className="text-sm">
              <th>
                <input
                  type="checkbox"
                  title="select all items"
                  checked={
                    deletedPost.length > 0 &&
                    selectedIds.length === deletedPost.length
                  }
                  onChange={handleToggleSelected}
                />
              </th>
              <th>Name</th>
              <th>Author User </th>

              <th>Tags</th>

              <th>Date Created</th>
              <th>Date Modified</th>
              <th>Is Paid</th>
              <th>Is Deleted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deletedPost.map((p) => {
              const isChecked = selectedIds.includes(p.id);
              return (
                <tr className="align-middle text-center" key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      title="Select item"
                      checked={
                        isChecked
                      }
                      onChange={() => handleSelected(p.id)}
                    />
                  </td>
                  <td>{p.name}</td>
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
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        handleSelected(p.id);
                        handleRestore([p.id]);
                      }}
                    >
                      <CIcon icon={cilReload} size="sm" title="Restore post " />
                    </button>
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
