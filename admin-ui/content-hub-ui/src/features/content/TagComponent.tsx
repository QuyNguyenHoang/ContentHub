import { useEffect, useState, useCallback } from "react";
import { tagApi } from "../../api/content/tag.api";
import type { TagResponse } from "../../api/content/tag.api";
import TagTable from "../../pages/content/TagUI/TagUI";
import TagCreateDrawer from "../../pages/content/TagUI/CreateTagUI";
import Paging from "../../components/common/PagingComponent";
import Toast from "../../components/common/Toast";
export default function TagList() {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [keyword, setKeyword] = useState("");
  const [pageCount, setPageCount] = useState(1);



  const [visible, setVisible] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const placeholder = "Search tag ...";
  //toast
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };

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
  // SAVE (Create + Update)
  // ======================
  const handleSave = async (name: string) => {
    try {
      if (selectedId) {
        await tagApi.update(selectedId, { name });

        showAlert("Update tag successfully!", "success");
      } else {
        await tagApi.create({ name });

        showAlert("Create tag successfully!", "success");
      }

      setVisible(false);

      setSelectedId(null);

      setName("");

      await loadTags();
    } catch (error) {
      console.error("Save failed:", error);
      showAlert("Save failed!!!", "danger");
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

      showAlert("Delete tag successfully!", "success");
    } catch (error) {
      console.error("Delete failed:", error);

      showAlert("Delete tag failed!!!", "danger");
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

      showAlert("Delete tag successfully!", "success");

      setSelectedIds([]);
    } catch (error) {
      console.error("Delete failed:", error);
      showAlert("Delete tags failed!!!", "danger");
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
              placeholder={placeholder}
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
        <Paging
          currentPage={pageNumber}
          totalPages={pageCount}
          onPageChange={setPageNumber}
        />
      </div>
      {/* TOAST */}
      <Toast
        message={message}
        showToast={showToast}
        alertColor={alertColor}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
