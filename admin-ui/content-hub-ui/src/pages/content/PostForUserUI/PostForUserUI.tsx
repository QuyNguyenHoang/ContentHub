import type { PostResponse } from "../../../api/content/post.api";
import DOMPurify from "dompurify";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  posts?: PostResponse[];
}

export function PostList({ posts = [] }: Props) {
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
    <div className="row justify-content-between g-5">
      <div className="col-lg-9">
        <div className="card p-3 mb-4">
          <textarea
            maxLength={256}
            className="form-control mb-2"
            placeholder="What's on your mind?"
            rows={loadForm ? 4 : 2}
            value={content}
            onChange={(e) => {
              const value = e.target.value;
              setContent(value); // cập nhật content
              setCount(value.length); // cập nhật số ký tự realtime
            }}
            onFocus={() => setLoadForm(true)}
            onBlur={(e) => {
              // e.relatedTarget là element mà focus chuyển tới
              if (
                !(
                  (e.relatedTarget &&
                    (e.relatedTarget as HTMLElement).tagName === "BUTTON") ||
                  (e.relatedTarget as HTMLElement).id === "LinkNewPost"
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
                <small className="text-muted me-2">
                  {count} / 256 characters
                </small>
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
        {posts.map((post) => (
          <div
            key={post.id}
            className="card mb-4 border-0 shadow-lg rounded-4"
            style={{ transition: "0.25s" }}
          >
            <div className="card-body p-4">
              {/* Title */}
              <h2 className="fw-bold">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-dark text-decoration-none"
                >
                  {post.name}
                </Link>
              </h2>

              {/* Meta */}
              <div className="text-muted small mb-2">
                👤 Admin • 5 min read • March 2026
              </div>

              {/* Preview */}
              <div
                className="text-secondary mb-3"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content || ""),
                }}
              />

              {/* Read more */}
              <Link
                to={`/posts/${post.id}`}
                className="text-primary fw-medium text-decoration-none"
              >
                Read more →
              </Link>

              <hr />

              {/* Actions */}
              <div className="d-flex justify-content-between">
                <div className="d-flex gap-3">
                  <button className="btn btn-light btn-sm">👍 Like</button>
                  <Link
                    to={`/posts/${post.id}#comments`}
                    className="btn btn-light btn-sm text-decoration-none"
                  >
                    💬 Comment
                  </Link>
                </div>

                <button className="btn btn-light btn-sm">🔖 Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Side bar right */}
      <div
        className="col-lg-3 bg-white rounded-4 border-0 shadow-lg p-3"
        style={{ height: "100vh" }}
      >
        {/* Tiêu đề sidebar */}
        <h5 className="text-danger text-center">HOT</h5>

        {/* Danh sách link */}
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-dark fw-medium p-2 rounded hover-bg-light"
            >
              Link 1
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-dark fw-medium p-2 rounded hover-bg-light"
            >
              Link 2
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-dark fw-medium p-2 rounded hover-bg-light"
            >
              Link 3
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
