import { useEffect, useState, useCallback } from "react";
import { seriesApi } from "../../api/content/series.api";
import Paging from "../../components/common/PagingComponent";
import type {
  SeriesResponse,
  SeriesRequest,
} from "../../api/content/series.api";
import SeriesTable from "../../pages/content/SeriesUI/SeriesUI";
import SeriesCreateDrawer from "../../pages/content/SeriesUI/SeriesForm";
import { jwtDecode } from "jwt-decode";
import SearchBox from "../../components/common/SearchBox";
import Toast from "../../components/common/Toast";

interface JwtPayload {
  userId?: string;
  sub?: string;
}
export default function SeriesList() {
  const [series, setSeries] = useState<SeriesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 1;
  const [pageCount, setPageCount] = useState(1);
  const [filter, setFilter] = useState("active");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  //Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
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

  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
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
        showAlert("Update Successful!", "success");
      } else {
        // CREATE
        await seriesApi.createSeries(seriesRequest);
        showAlert("Create Successful!", "success");
      }

      await loadSeries(); // reload list

      setVisible(false); // close drawer
    } catch (error) {
      console.error("Save failed", error);
      showAlert("Save failed", "danger");
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

  //Load Series
  const loadSeries = useCallback(async () => {
    try {
      setLoading(true);

      const res = await seriesApi.getPaging({
        keyword,
        pageNumber,
        pageSize,
        filter,
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
  }, [keyword, pageNumber, pageSize, filter]);

  // reset page khi filter thay đổi
  useEffect(() => {
    setPageNumber(1);
  }, [filter]);

  // load data
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
        showAlert("Delete Successful!", "success");
        await loadSeries();
      } catch (error) {
        console.log("Delete failed!!!", error);
        showAlert("Delete Failed!!!", "danger");
      }
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} items?`,
    );
    if (confirmDelete) {
      try {
        await seriesApi.deleteSeries(selectedIds);
        showAlert("Delete Successful!", "success");
        await loadSeries();
        setSelectedIds([]);
      } catch (error) {
        console.log("Can not delete", error);
        showAlert("Delete Failed!", "danger");
      }
    }
  };

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
            <SearchBox
              keyword={keyword}
              onChangeKeyword={(value) => {
                setKeyword(value);
                setPageNumber(1);
              }}
              loadData={loadSeries}
              placeholder="Search series..."
            />

            {/* Selected Delete */}
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
              filter={filter}
              setFilter={setFilter}
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
        <Paging
          currentPage={pageNumber}
          totalPages={pageCount}
          onPageChange={setPageNumber}
        />
      </div>
      {/* TOAST */}
      <Toast
        showToast={showToast}
        message={message}
        alertColor={alertColor}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
