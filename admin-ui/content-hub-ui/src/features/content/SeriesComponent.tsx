import { useEffect, useState, useCallback } from "react";
import { seriesApi } from "../../api/content/series.api";
import type {
  SeriesResponse,
  SeriesRequest,
} from "../../api/content/series.api";
import SeriesTable from "../../pages/content/SeriesUI/SeriesUI";
import SeriesCreateDrawer from "../../pages/content/SeriesUI/SeriesForm";
import { jwtDecode } from "jwt-decode";
export default function SeriesList() {
  const [series, setSeries] = useState<SeriesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  // Pagination logic
  const visiblePages = 5;

  let startPage = Math.max(pageNumber - Math.floor(visiblePages / 2), 1);
  let endPage = startPage + visiblePages - 1;

  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(pageCount - visiblePages + 1, 1);
  }

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [progress, setProgress] = useState(100);

  //field
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [seriesRequest, setSeriesRequest] = useState<SeriesRequest>({
    name: "",
    description: "",
    sortOrder: 0,
    seoKeywords: "",
    seoDescription: "",
    thumbnail: "",
    content: "",
    userId: "",
  });

  interface JwtPayload {
    userId?: string;
    sub?: string;
  }

  //upload Thubnail
  
  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.userId || decoded.sub || null;
    } catch (error) {
      console.error("Token decode failed", error);
      return null;
    }
  };

  const handleCreate = () => {
    setSelectedId(null);

    const userId = getUserIdFromToken();

    console.log(userId);

    setSeriesRequest({
      name: "",
      description: "",
      sortOrder: 0,
      seoKeywords: "",
      seoDescription: "",
      thumbnail: "",
      content: "",
      userId: userId ?? undefined,
    });

    setVisible(true);
  };
  //handleEdit
  const handleEdit = async (id: string) => {
    setSelectedId(id);
    await loadById(id);
    setVisible(true);
  };
  //Close form
  const closeDrawer = () => {
    setVisible(false);
    setSelectedId(null);
  };
  //Select All
  const toggleSelectAll = () => {
    if (selectedIds.length === series.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(series.map((x) => x.id));
    }
  };

  //Save
  const handleSave = async () => {
    try {
      if (selectedId) {
        // UPDATE
        await seriesApi.updateSeries(selectedId, seriesRequest);

        setAlert("Update Successful!");
        setAlertColor("success");
      } else {
        // CREATE
        await seriesApi.createSeries(seriesRequest);

        setAlert("Create Successful!");
        setAlertColor("success");
      }

      loadSeries(); // reload list
      loadAlert(); // show alert
      setVisible(false); // close drawer
    } catch (error) {
      console.error("Save failed", error);

      setAlert("Save Failed!");
      setAlertColor("danger");
      loadAlert();
    }
  };
  //load by id
  const loadById = async (id: string) => {
    try {
      const res = await seriesApi.getSeriesById(id);
      const data = res.data;

      setSeriesRequest({
        name: data.name,
        description: data.description ?? "",
        sortOrder: data.sortOrder,
        seoKeywords: data.seoKeywords ?? "",
        seoDescription: data.seoDescription ?? "",
        thumbnail: data.thumbnail ?? "",
        content: data.content ?? "",
        userId: data.userId ?? "",
      });
    } catch (error) {
      console.error("Load failed", error);
    }
  };
  //Load toast Alert
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
  //Load Series
  const loadSeries = useCallback(async () => {
    try {
      setLoading(true);

      const res = await seriesApi.getPaging({
        keyword,
        pageNumber,
        pageSize,
      });

      const data = res.data;
      setSeries(data.results);
      setPageCount(data.pageCount);
    } catch (error) {
      console.error("Failed to load series", error);
    } finally {
      setLoading(false);
      setSelectedIds([]);
    }
  }, [keyword, pageNumber, pageSize]);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  //Select Row
  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  //delete
  const handleDeleted = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this series?",
    );
    if (confirmDelete) {
      try {
        await seriesApi.deleteSeries([id]);
        setAlert("Delete Successfull!");
        setAlertColor("success");
        loadAlert();
        loadSeries();
      } catch (error) {
        console.log("Delete failed!!!", error);
        setAlert("Delete Failed!!!");
        setAlertColor("danger");
        loadAlert();
      }
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedIds.length == 0) {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} items?`,
    );
    if (confirmDelete) {
      try {
        await seriesApi.deleteSeries(selectedIds);
        setAlert("Delete is successfully!");

        setAlertColor("success");
        loadAlert();
        loadSeries();
        setSelectedIds([]);
      } catch (error) {
        console.log("Can not delete", error);
      }
    }
  };
  console.log(selectedIds);
  return (
    <div className="container mt-4">
      <div className="card min-vh-100 d-flex flex-column p-3">
        {/* HEADER */}
        <div className="mb-3">
          <div className="d-flex justify-content-center">
            <h3>Series Management</h3>
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
                onClick={() => loadSeries()}
              >
                Search
              </button>
            </div>
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

        {/* CONTENT */}
        <div className="flex-grow-1">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <SeriesTable
              series={series}
              toggleSelectItem={toggleSelectItem}
              toggleSelectAll={toggleSelectAll}
              selectedIds={selectedIds}
              onDelete={handleDeleted}
              onEdit={handleEdit}
              onCreate={handleCreate}
            />
          )}
          <SeriesCreateDrawer
            visible={visible}
            onClose={closeDrawer}
            onSave={handleSave}
            selectedId={selectedId}
            series={seriesRequest}
            setSeries={setSeriesRequest}
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
