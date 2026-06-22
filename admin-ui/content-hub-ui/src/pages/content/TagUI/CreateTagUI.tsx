import { useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  selectedId: string | null;
  name: string;
  setName: (value: string) => void;
}

export default function TagCreateDrawer({
  visible,
  name,
  setName,
  onClose,
  onSave,
  selectedId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const slug = generateSlug(name);

  const handleClose = () => {
    setName("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await onSave(name);

      setTimeout(() => {
        handleClose();
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {visible && <div className="offcanvas-backdrop fade show"></div>}

      <div
        className={`offcanvas offcanvas-end ${visible ? "show" : ""} col-12 col-sm-6 col-lg-3`}
        style={{ visibility: visible ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">
            {selectedId ? "Edit Tag" : "Create Tag"}
          </h5>

          <button
            className="btn-close"
            onClick={handleClose}
            disabled={loading}
          />
        </div>

        <div className="offcanvas-body">
          <div className="mb-3 mb-md-4">
            <label className="form-label">Tag Name</label>

            <input
              autoFocus
              type="text"
              className="form-control"
              placeholder="Enter tag name"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Slug</label>

            <input
              type="text"
              className="form-control bg-light"
              value={slug}
              readOnly
            />
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            disabled={!name || loading}
            onClick={handleSubmit}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2"></span>
            )}

            {loading ? "Saving..." : selectedId ? "Update Tag" : "Create Tag"}
          </button>
        </div>
      </div>
    </>
  );
}
