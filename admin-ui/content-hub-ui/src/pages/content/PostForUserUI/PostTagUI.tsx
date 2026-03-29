import { useState, useRef, useEffect } from "react";
import { tagApi, type TagList } from "../../../api/content/tag.api";

export default function TagList() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<TagList[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await tagApi.getDropdown();
        setTags(res.data);
      } catch (err) {
        console.error("Error loading tags:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const getTagName = (id: string) => tags.find((t) => t.id === id)?.name;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" style={{ width: "100%", maxWidth: "400px" }} ref={dropdownRef}>
      {/* Click area */}
      <div
        className="form-control d-flex justify-content-between align-items-center flex-wrap"
        style={{ cursor: "pointer", minHeight: "48px", gap: "4px" }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {loading ? (
          <span className="text-muted d-flex align-items-center">
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Loading tags...
          </span>
        ) : selectedTags.length === 0 ? (
          <span className="text-muted">Chọn tag...</span>
        ) : (
          <div className="d-flex flex-wrap gap-1">
            {selectedTags.map((id) => (
              <span
                key={id}
                className="badge bg-primary d-flex align-items-center"
                style={{ fontSize: "0.875rem", padding: "0.35em 0.65em" }}
              >
                {getTagName(id)}
                <i
                  className="bi bi-x ms-2"
                  style={{ cursor: "pointer", fontSize: "0.8rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTag(id);
                  }}
                ></i>
              </span>
            ))}
          </div>
        )}
        <i className={`bi ${dropdownOpen ? "bi-chevron-up" : "bi-chevron-down"} ms-2`}></i>
      </div>

      {/* Dropdown */}
      {dropdownOpen && !loading && (
        <ul
          className="dropdown-menu show w-100 mt-1 shadow-sm border rounded p-2"
          style={{
            zIndex: 1000,
            maxHeight: "250px",
            overflowY: "auto",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <li key={tag.id}>
                <button
                  type="button"
                  className={`dropdown-item d-flex justify-content-between align-items-center ${
                    isSelected ? "active bg-primary text-white" : "text-dark"
                  }`}
                  onClick={() => toggleTag(tag.id)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.375rem",
                    marginBottom: "0.25rem",
                    transition: "background 0.2s",
                  }}
                >
                  {tag.name}
                  {isSelected && <i className="bi bi-check-lg"></i>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}