import CIcon from "@coreui/icons-react";
import type { PostResponse } from "../../../api/content/post.api";
import { Link } from "react-router-dom";
import { cilThumbUp } from "@coreui/icons";
import { useState } from "react";
import { BsClock, BsGlobe, BsPeople, BsThreeDotsVertical } from "react-icons/bs";

interface Props {
  posts?: PostResponse[];
}

export function PostList({ posts = [] }: Props) {
  const [likeMap, setLikeMap] = useState<Record<string, boolean>>({});

  const handleLike = (postId: string) => {
    setLikeMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="card rounded-5 border-0 shadow-sm p-2 w-50 mb-2">
          <div className="btn-group w-100 col-md-5">
            <button className="btn btn-light  rounded-pill d-flex align-items-center justify-content-center gap-2">
              <BsGlobe />
              Discover
            </button>

            <button className="btn btn-light rounded-pill d-flex align-items-center justify-content-center gap-2">
              <BsPeople />
              Following
            </button>

            <button className="btn btn-light rounded-pill d-flex align-items-center justify-content-center gap-2">
              <BsClock />
              Latest
            </button>
          </div>
        </div>
        <div>
          <button className="btn">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>
      {posts.map((post) => {
        const formattedDate = new Date(post.dateCreated).toLocaleString(
          "vi-VN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          },
        );
        return (
          <div>
            <div
              key={post.id}
              className="card mb-4 border-0 shadow-lg rounded-4"
              style={{ transition: "0.25s" }}
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div
                  className="w-100 border-bottom"
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <img
                    className="w-100 rounded-top-4"
                    src={post.coverImage}
                    alt={post.name}
                    style={{
                      display: "block",
                      height: "200px",
                    }}
                  />
                </div>
              )}

              <div className="card-body p-4">
                {/* Meta */}
                <div className="d-flex align-items-center mb-2">
                  {/* Avatar */}
                  <img
                    src={
                      post.authorAvatar ||
                      "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775028937/penguin_qkob1d.jpg"
                    }
                    alt={post.authorName}
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  {/* Info */}
                  <div className="d-flex flex-column">
                    <span className="fw-bold small">{post.authorName}</span>
                    <span className="text-muted fst-italic xsmall">
                      {formattedDate}
                    </span>
                  </div>
                </div>
                {/* Title */}
                <h2 className="fw-bold">
                  <Link
                    to={`/posts/${post.slug}-${post.id}`}
                    className="text-dark text-decoration-none link-primary"
                  >
                    {post.name}
                  </Link>
                </h2>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {post.listTag?.map((tag) => (
                    <Link
                      key={tag.slug}
                      to={`/tags/${tag.slug}`}
                      className="badge rounded-pill bg-light text-dark text-decoration-none"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>

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
                    <button
                      className={`btn btn-sm ${likeMap[post.id] ? "text-primary fw-bold" : "text-black"}`}
                      onClick={() => handleLike(post.id)}
                      onKeyDown={(e) => {
                        if (e.key.toLowerCase() === "a") {
                          handleLike(post.id);
                        }
                      }}
                    >
                      <CIcon icon={cilThumbUp} />
                      Like
                    </button>
                    <Link
                      to={`/posts/${post.id}#comments`}
                      className="btn btn-light btn-sm text-decoration-none"
                    >
                      {post.commentCount > 0
                        ? `(${post.commentCount}) ${post.commentCount === 1 ? "Comment" : "Comments"}`
                        : "No comments"}
                    </Link>
                  </div>

                  <button className="btn btn-light btn-sm">🔖 Save</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
