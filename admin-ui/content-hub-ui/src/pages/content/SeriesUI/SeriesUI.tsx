import { useState } from "react";
import CIcon from "@coreui/icons-react";
import type { SeriesResponse } from "../../../api/content/series.api";
import {
  cilCloudDownload,
  cilSpreadsheet,
  cilPencil,
  cilTrash,
  cilReload,
  cilFilter,
  cilSortAlphaDown,
} from "@coreui/icons";

interface Props {
  series: SeriesResponse[];
  toggleSelectItem: (id: string) => void;
  selectedIds: string[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
  toggleSelectAll: () => void;
}

export default function SeriesTable({
  series = [],
  toggleSelectItem,
  toggleSelectAll,
  selectedIds,
  onDelete,
  onEdit,
  onCreate,
}: Props) {
  const [filter, setFilter] = useState("active");
  const [sortType, setSortType] = useState("date");

  if (series.length === 0) {
    return <div className="text-center py-5 text-muted">No series found</div>;
  }

  // PROCESS DATA
  let processedSeries = [...series];

  // FILTER
  if (filter === "active") {
    processedSeries = processedSeries.filter((s) => s.isActive);
  } else if (filter === "deleted") {
    processedSeries = processedSeries.filter((s) => !s.isActive);
  } else {
    processedSeries = processedSeries.filter((s) => !s.isActive || s.isActive);
  }

  // SORT
  if (sortType === "name") {
    processedSeries.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortType === "date") {
    processedSeries.sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );
  }

  return (
    <div className="card shadow-sm">
      {/* HEADER */}
      <div className="card-header bg-white border-0">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <button className="btn btn-primary btn-sm" onClick={onCreate}>
            + Create Series
          </button>

          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              title="This function will be updated soon!!"
            >
              Upload Excel
              <CIcon icon={cilSpreadsheet} className="ms-1" />
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              title="Export Excel"
            >
              <CIcon icon={cilCloudDownload} />
            </button>
          </div>
        </div>

        {/* SORT + FILTER */}
        <div className="d-flex justify-content-end align-items-center gap-2 pt-3">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center"
            onClick={() => setSortType(sortType === "date" ? "name" : "date")}
          >
            <CIcon icon={cilSortAlphaDown} className="me-1" />
            Sort
          </button>

          <div
            className="input-group input-group-sm"
            style={{ width: "170px" }}
          >
            <span className="input-group-text">
              <CIcon icon={cilFilter} />
            </span>

            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === series.length}
                    onChange={toggleSelectAll}
                  />
                </th>

                <th className="text-center">Sort</th>

                <th>Name</th>

                <th className="text-center">Thumbnail</th>

                <th className="text-nowrap">Date Created</th>

                <th className="text-center">Status</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {processedSeries.map((s) => {
                const isChecked = selectedIds.includes(s.id);

                return (
                  <tr key={s.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectItem(s.id)}
                      />
                    </td>

                    <td className="text-center">{s.sortOrder}</td>

                    <td className="fw-semibold text-nowrap">{s.name}</td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-1">
                        {s.thumbnail && (
                          <img
                            src={`https://localhost:7202${s.thumbnail}`}
                            alt="thumbnail"
                            className="rounded"
                            width="50"
                          />
                        )}

                        <CIcon
                          icon={cilPencil}
                          size="sm"
                          style={{ cursor: "pointer" }}
                          onClick={() => onEdit(s.id)}
                        />
                      </div>
                    </td>

                    <td className="text-nowrap">
                      {new Date(s.dateCreated).toLocaleDateString()}
                    </td>

                    <td className="text-center">
                      <span
                        className={`badge ${
                          s.isActive ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {s.isActive ? "Active" : "Deleted"}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {s.isActive ? (
                          <>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => onEdit(s.id)}
                            >
                              <CIcon icon={cilPencil} size="sm" />
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                onDelete(s.id);
                              }}
                            >
                              <CIcon icon={cilTrash} size="sm" />
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-outline-success btn-sm">
                            <CIcon
                              icon={cilReload}
                              size="sm"
                              title="Click to RESTORE - Permanently deleted after 30 day!!!"
                            />
                          </button>
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

      {/* FOOTER */}
      <div className="card-footer text-muted small">
        Total series: {processedSeries.length}
      </div>
    </div>
  );
}
