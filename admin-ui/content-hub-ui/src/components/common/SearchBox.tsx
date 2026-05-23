interface SearchBoxProps {
  placeholder?: string;
  keyword: string;
  onChangeKeyword: (value: string) => void;
  loadData: () => void;
}

export default function SearchBox({
  placeholder = "Search...",
  keyword,
  onChangeKeyword,
  loadData,
}: SearchBoxProps) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) =>
            onChangeKeyword(e.target.value)
          }
        />
      </div>

      <div className="col-6 col-md-auto">
        <button
        type="button"
          className="btn btn-primary w-100"
          onClick={loadData}
        >
          Search
        </button>
      </div>
    </div>
  );
}