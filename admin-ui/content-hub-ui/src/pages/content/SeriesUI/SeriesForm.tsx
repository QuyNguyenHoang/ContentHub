import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { seriesApi } from "../../../api/content/series.api";

interface SeriesRequest {
  name: string;
  description?: string;
  sortOrder?: number;
  seoKeywords?: string;
  seoDescription?: string;
  thumbnail?: string;
  content?: string;
  userId?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  selectedId: string | null;
  series: SeriesRequest;
  setSeries: Dispatch<SetStateAction<SeriesRequest>>;
}

export default function SeriesCreateDrawer({
  visible,
  onClose,
  onSave,
  selectedId,
  series,
  setSeries,
}: Props) {
   const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof SeriesRequest, value: any) => {
    setSeries((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClose = () => {
    setSeries({
      name: "",
      description: "",
      sortOrder: undefined,
      seoKeywords: "",
      seoDescription: "",
      thumbnail: "",
      content: "",
      userId: "",
    });

    onClose();
  };

  const handleSubmit = async () => {
    if (!series.name.trim()) return;

    try {
      setLoading(true);

      await onSave();

      setTimeout(() => {
        handleClose();
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {visible && <div className="offcanvas-backdrop fade show"></div>}

      <div
        className={`offcanvas offcanvas-end ${visible ? "show" : ""} col-12 col-sm-6 col-lg-4`}
        style={{ visibility: visible ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">
            {selectedId ? "Edit Series" : "Create Series"}
          </h5>

          <button
            className="btn-close"
            onClick={handleClose}
            disabled={loading}
          />
        </div>

        <div className="offcanvas-body">
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label">Series Name</label>
            <input
              className="form-control"
              value={series.name}
              disabled={loading}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={series.description || ""}
              disabled={loading}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* SORT ORDER */}
          <div className="mb-3">
            <label className="form-label">Sort Order</label>
            <input
              type="number"
              className="form-control"
              value={series.sortOrder ?? ""}
              disabled={loading}
              onChange={(e) =>
                handleChange("sortOrder", Number(e.target.value))
              }
            />
          </div>

          {/* SEO KEYWORDS */}
          <div className="mb-3">
            <label className="form-label">SEO Keywords</label>
            <input
              className="form-control"
              value={series.seoKeywords || ""}
              disabled={loading}
              onChange={(e) => handleChange("seoKeywords", e.target.value)}
            />
          </div>

          {/* SEO DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label">SEO Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={series.seoDescription || ""}
              disabled={loading}
              onChange={(e) => handleChange("seoDescription", e.target.value)}
            />
          </div>

          {/* THUMBNAIL */}
          <div className="mb-3">
            <label className="form-label">Thumbnail</label>

            {series.thumbnail && (
              <div className="mb-2">
                <img
                  src={`${API_URL}/${series.thumbnail}`}
                  alt="preview"
                  width="120"
                  className="rounded border"
                />
              </div>
            )}

            <input
              type="file"
              className="form-control"
              accept="image/*"
              disabled={loading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  setLoading(true);

                  const res = await seriesApi.uploadMedia(file, "thumbnail");

                  // lấy path backend trả về
                  const path = res.data.path;

                  handleChange("thumbnail", path);
                } catch (error) {
                  console.error("Upload failed:", error);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>

          {/* CONTENT */}
          <div className="mb-4">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows={5}
              value={series.content || ""}
              disabled={loading}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            disabled={!series.name || loading}
            onClick={handleSubmit}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2"></span>
            )}

            {loading
              ? "Saving..."
              : selectedId
                ? "Update Series"
                : "Create Series"}
          </button>
        </div>
      </div>
    </>
  );
}
