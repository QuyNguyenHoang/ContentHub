import type { PostResponse } from "../../../api/content/post.api";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

interface Props {
  posts?: PostResponse[];
}

export function PostList({ posts = [] }: Props) {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-12">

        {posts.map((post) => (
          <div
            key={post.id}
            className="card mb-4 border-0 shadow-sm rounded-4"
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

                <button className="btn btn-light btn-sm">
                  🔖 Save
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}