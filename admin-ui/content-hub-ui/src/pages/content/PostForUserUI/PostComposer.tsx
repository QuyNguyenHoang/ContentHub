import { useState } from "react";
import { Link } from "react-router-dom";
export function PostComposer() {
  const [content, setContent] = useState("");
  const [loadForm, setLoadForm] = useState(false); // trạng thái form mở rộng
  const [count, setCount] = useState(0);
  const handlePost = () => {
    if (!content.trim()) return alert("Enter something first!");
    console.log("Post content:", content);
    setContent("");
    setLoadForm(false); // reset form
  };
  return (
    <div className="card p-3 mb-4">
      <textarea
        maxLength={256}
        className="form-control mb-2"
        placeholder="What's on your mind?"
        rows={loadForm ? 4 : 2}
        value={content}
        onChange={(e) => {
          const value = e.target.value;
          setContent(value); 
          setCount(value.length);
        }}
        onFocus={() => setLoadForm(true)}
        onBlur={(e) => {
          if (
            !(
              (e.relatedTarget &&
                (e.relatedTarget as HTMLElement).tagName === "BUTTON") ||
              (e.relatedTarget &&
                (e.relatedTarget as HTMLElement).id === "LinkNewPost")
            )
          ) {
            setLoadForm(false);
          }
        }}
      ></textarea>

      {loadForm && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="mt-2">
            <Link
              id="LinkNewPost"
              to="/new"
              className="text-primary fw-medium text-decoration-none"
            >
              Open Full Editor
            </Link>
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <small className="text-muted me-2">{count} / 256 characters</small>
            <button
              name="BUTTON"
              className="btn btn-primary"
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
