import { useEffect, useState, useCallback } from "react";
import { tagApi } from "../../api/content/content.api";
import type { TagResponse } from "../../api/content/content.api";
import TagTable from "../../pages/content/TagUI/TagUI";
import TagCreateDrawer from "../../pages/content/TagUI/CreateTagUI";
export default function TagList() {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [pageCount, setPageCount] = useState(1);
  // Pagination logic
  const visiblePages = 5;

  let startPage = Math.max(pageNumber - Math.floor(visiblePages / 2), 1);
  let endPage = startPage + visiblePages - 1;

  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(pageCount - visiblePages + 1, 1);
  }

  const [visible, setVisible] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [name, setName] = useState("");

  const [alert, setAlert] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [progress, setProgress] = useState(100);

  // ======================
  // Load Tag By Id (EDIT)
  // ======================
  const loadById = async (id: string) => {
    try {
      const res = await tagApi.getById(id);
      const data = res.data;

      setName(data.name);
      setSelectedId(id);

      setVisible(true);
    } catch (error) {
      console.error("Load tag failed:", error);
    }
  };

  // ======================
  // Toast Alert
  // ======================
  const loadAlert = () => {
    setProgress(100);

    let value = 100;

    const interval = setInterval(() => {
      value -= 2;

      setProgress(value);

      if (value <= 0) {
        clearInterval(interval);
        setAlert(null);
      }
    }, 60);
  };

  // ======================
  // SAVE (Create + Update)
  // ======================
  const handleSave = async (name: string) => {
    try {
      if (selectedId) {
        await tagApi.update(selectedId, { name });

        setAlert("Tag updated successfully");
      } else {
        await tagApi.create({ name });

        setAlert("Tag created successfully");
      }

      setAlertColor("success");

      setVisible(false);

      setSelectedId(null);

      setName("");

      await loadTags();

      loadAlert();
    } catch (error) {
      console.error("Save failed:", error);

      setAlertColor("danger");

      setAlert("Name or Slug already exist!!!");

      loadAlert();
    }
  };

  // ======================
  // Load Tags
  // ======================
  const loadTags = useCallback(async () => {
    try {
      setLoading(true);

      const res = await tagApi.getPaging({
        keyword,
        pageNumber,
        pageSize,
      });

      const data = res.data;

      setTags(data.results);

      setPageCount(data.pageCount);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setLoading(false);

      setSelectedIds([]);
    }
  }, [keyword, pageNumber, pageSize]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // ======================
  // Select Row
  // ======================
  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ======================
  // Delete One
  // ======================
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this tag?");
    if (!confirmDelete) return;

    try {
      await tagApi.delete([id]);

      await loadTags();

      setAlert("Delete is successfully!");

      setAlertColor("success");

      loadAlert();
    } catch (error) {
      console.error("Delete failed:", error);

      setAlert("Can not delete!!!");

      setAlertColor("danger");

      loadAlert();
    }
  };

  // ======================
  // Delete Selected
  // ======================
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm("Delete selected tags?");
    if (!confirmDelete) return;

    try {
      await tagApi.delete(selectedIds);

      await loadTags();

      setAlert("Delete is successfully!");

      setAlertColor("success");

      loadAlert();

      setSelectedIds([]);
    } catch (error) {
      console.error("Delete failed:", error);

      setAlert("Can not delete!!!");

      setAlertColor("danger");

      loadAlert();
    }
  };

  return (
    <div className="container mt-4">
      <div className="card min-vh-100 d-flex flex-column p-3">
        {/* HEADER */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <h3>Tag Management</h3>
        </div>

        {/* SEARCH */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search tag..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPageNumber(1);
              }}
            />
          </div>

          <div className="col-6 col-md-auto">
            <button
              className="btn btn-primary w-100"
              onClick={() => setPageNumber(1)}
            >
              Search
            </button>
          </div>

          {selectedIds.length > 0 && (
            <div className="col-6 col-md-auto">
              <button
                className="btn btn-danger w-100"
                onClick={handleDeleteSelected}
              >
                Delete ({selectedIds.length})
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="flex-grow-1">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <TagTable
              tags={tags}
              selectedIds={selectedIds}
              toggleSelectItem={toggleSelectItem}
              onDelete={handleDelete}
              onEdit={loadById}
              onCreateClick={() => {
                setSelectedId(null);
                setName("");
                setVisible(true);
              }}
            />
          )}

          {/* DRAWER */}
          <TagCreateDrawer
            visible={visible}
            name={name}
            setName={setName}
            onClose={() => setVisible(false)}
            onSave={handleSave}
            selectedId={selectedId}
          />
        </div>
        {/* PAGINATION */}

        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mt-3 gap-2">
          <ul className="pagination mb-0 flex-wrap justify-content-center">
            {/* FIRST */}
            <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPageNumber(1)}>
                «
              </button>
            </li>

            {/* PREV */}
            <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              >
                ‹
              </button>
            </li>

            {/* SHOW FIRST PAGE IF HIDDEN */}
            {startPage > 1 && (
              <>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => setPageNumber(1)}
                  >
                    1
                  </button>
                </li>

                {startPage > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
              </>
            )}

            {/* PAGE NUMBERS */}
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            ).map((page) => (
              <li
                key={page}
                className={`page-item ${pageNumber === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNumber(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            {/* SHOW LAST PAGE IF HIDDEN */}
            {endPage < pageCount && (
              <>
                {endPage < pageCount - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => setPageNumber(pageCount)}
                  >
                    {pageCount}
                  </button>
                </li>
              </>
            )}

            {/* NEXT */}
            <li
              className={`page-item ${pageNumber >= pageCount ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, pageCount))
                }
              >
                ›
              </button>
            </li>

            {/* LAST */}
            <li
              className={`page-item ${pageNumber >= pageCount ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNumber(pageCount)}
              >
                »
              </button>
            </li>
          </ul>

          {/* PAGE SELECT */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <span className="small">Go to page</span>

            <select
              className="form-select form-select-sm"
              style={{ width: "70px" }}
              value={pageNumber}
              onChange={(e) => setPageNumber(Number(e.target.value))}
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <span className="small">of {pageCount}</span>
          </div>
        </div>
      </div>
      {/* TOAST */}
      {alert && (
        <div
          className="toast show"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            minWidth: 300,
            zIndex: 9999,
          }}
        >
          <div className={`toast-header text-white bg-${alertColor}`}>
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              onClick={() => setAlert(null)}
            />
          </div>

          <div className="toast-body">
            {alert}

            <div className="progress mt-2" style={{ height: 4 }}>
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
