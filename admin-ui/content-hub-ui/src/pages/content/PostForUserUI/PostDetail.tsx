import { useParams } from "react-router-dom";
import {
  postApi,
  type PostDetailResponse,
} from "../../../api/content/post.api";
import { useEffect, useState } from "react";

export function PostDetail() {
  const { slug } = useParams();

  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const postId = slug ? slug.slice(-36) : null;

  const getPostById = async () => {
    try {
      if (!postId) return;

      setLoading(true);
      const res = await postApi.getById(postId);
      setPost(res.data);
    } catch (error) {
      console.log("Load post detail fail", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostById();
  }, [postId]);

  return (
    <div className="container my-5">
      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Post */}
      {post && (
        <>
          <div className="row justify-content-center">
            <div className="flex-grow-1">
              {/* Cover Image */}
              {
                post.coverImage && 
                  (<div> 
               <img
                  className="w-100 rounded-top-4"
                  src={post.coverImage}
                  alt={post.name}
                  style={{
                    display: "block",
                    height: "auto"
                  }}
                />
              </div>)
              }
              
              {/* Title */}
              <h2 className="fw-bold mb-3">{post.name}</h2>

              {/* Tags */}
              {post.listTag?.length > 0 && (
                <div className="mb-4">
                  {post.listTag.map((tag) => (
                    <span
                      key={tag.slug}
                      className="badge bg-light text-dark me-2"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div
                className="post-content"
                dangerouslySetInnerHTML={{
                  __html: post.content?.replace(
                    /<img /g,
                    '<img class="img-fluid rounded mx-auto d-block" ',
                  ),
                }}
              ></div>

              {/* Source */}
              {post.source && (
                <p className="mt-4 text-muted">
                  <strong>Source:</strong> {post.source}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
