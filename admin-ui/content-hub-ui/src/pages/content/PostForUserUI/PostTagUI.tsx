import { useState, useRef, useEffect } from "react";
import { tagApi, type TagList } from "../../../api/content/tag.api";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagList({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<TagList[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(value || []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tags
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

  // Sync với parent
  useEffect(() => {
    setSelectedTags(value || []);
  }, [value]);

  // Toggle tag
  const toggleTag = (id: string) => {
    const newTags = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id];

    setSelectedTags(newTags); // update local state
    onChange(newTags); // gọi ngoài (an toàn)
  };
  const getTagName = (id: string) => tags.find((t) => t.id === id)?.name;

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="position-relative mb-3"
      style={{ width: "100%", maxWidth: "400px" }}
      ref={dropdownRef}
    >
      {/* Input */}
      <div
        className="form-control d-flex justify-content-between align-items-center flex-wrap"
        style={{ cursor: "pointer", minHeight: "48px", gap: "4px" }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {loading ? (
          <span className="text-muted">Loading tags...</span>
        ) : selectedTags.length === 0 ? (
          <span className="text-muted">Chọn tag...</span>
        ) : (
          <div className="d-flex flex-wrap gap-1">
            {selectedTags.map((id) => (
              <span
                key={id}
                className="badge bg-primary d-flex align-items-center"
              >
                #{getTagName(id)}
                <i
                  className="bi bi-x ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTag(id);
                  }}
                />
              </span>
            ))}
          </div>
        )}

        <i
          className={`bi ${dropdownOpen ? "bi-chevron-up" : "bi-chevron-down"}`}
        />
      </div>

      {/* Dropdown */}
      {dropdownOpen && !loading && (
        <ul
          className="dropdown-menu show w-100 mt-1 shadow-sm p-2"
          style={{ maxHeight: "250px", overflowY: "auto" }}
        >
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <li key={tag.id}>
                <button
                  type="button"
                  className={`dropdown-item d-flex justify-content-between ${
                    isSelected ? "active bg-primary text-white" : ""
                  }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  #{tag.name}
                  {isSelected && <i className="bi bi-check-lg" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
