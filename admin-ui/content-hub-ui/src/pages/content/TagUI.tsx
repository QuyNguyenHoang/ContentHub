import CIcon from "@coreui/icons-react";
import type { TagResponse } from "../../api/content/content.api";
import { cilPencil, cilTrash } from "@coreui/icons";

interface Props {
  tags: TagResponse[];
  onDelete: (id: string) => void;
  toggleSelectItem: (id: string) => void;
  selectedIds: string[];
  onCreateClick: () => void;
  onEdit: (id: string) => void;
}

export default function TagTable({
  tags = [],
  onDelete,
  selectedIds,
  toggleSelectItem,
  onCreateClick,
  onEdit,
}: Props) {
  const isAllSelected = tags.length > 0 && selectedIds.length === tags.length;

  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < tags.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      tags.forEach((t) => toggleSelectItem(t.id));
    } else {
      tags
        .filter((t) => !selectedIds.includes(t.id))
        .forEach((t) => toggleSelectItem(t.id));
    }
  };

  if (tags.length === 0) {
    return <div className="text-center py-5 text-muted">No tags found</div>;
  }

  return (
    <div className="card">
      {/* HEADER */}
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={onCreateClick}>
          + Create Tag
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={toggleSelectAll}
                />
              </th>

              <th style={{ minWidth: 120 }}>Name</th>

              <th style={{ minWidth: 160 }}>Slug</th>

              <th style={{ width: 140 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {tags.map((tag) => {
              const isChecked = selectedIds.includes(tag.id);

              return (
                <tr key={tag.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectItem(tag.id)}
                    />
                  </td>

                  <td
                    className="fw-semibold text-truncate"
                    style={{ maxWidth: 180 }}
                    title={tag.name}
                  >
                    {tag.name}
                  </td>

                  <td
                    className="text-muted text-truncate"
                    style={{ maxWidth: 200 }}
                    title={tag.slug}
                  >
                    {tag.slug}
                  </td>

                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm "
                        onClick={() => onEdit(tag.id)}
                        disabled={selectedIds.length< 1}
                      >
                        <CIcon
                          icon={cilPencil}
                          size="sm"
                          className="edit-icon"
                          title="Edit"
                        />
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (confirm("Delete this tag?")) {
                            onDelete(tag.id);
                          }
                        }}
                      >
                        <CIcon
                          icon={cilTrash}
                          size="sm"
                          className="delete-icon"
                          title="Delete"
                        />
                      </button>
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
