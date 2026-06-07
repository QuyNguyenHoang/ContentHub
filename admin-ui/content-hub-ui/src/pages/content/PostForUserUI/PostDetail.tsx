import { BsCalendar2, BsEye, BsFacebook, BsLinkedin, BsNewspaper, BsTwitter } from "react-icons/bs";
import type { PostDetailResponse } from "../../../api/content/post.api";

interface Props {
  postDetail: PostDetailResponse | null;
  loading:boolean
}

export function PostDetail({ postDetail,loading }: Props) {
  return (
    <div className="container">
      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item ">
            <a className="text-decoration-none" href="/Home">
              Home
            </a>
          </li>

          <li className="breadcrumb-item">
            <a className="text-decoration-none" href="/posts">
              Posts
            </a>
          </li>

          <li className="breadcrumb-item active" aria-current="page">
            {postDetail?.name}
          </li>
        </ol>
      </nav>
      {/* Metadata */}
      <div className="d-flex gap-2 align-items-center mb-2">
        <span>Cate</span>

        <div className="d-flex align-items-center gap-1">
          <BsCalendar2 />
          <span>
            {postDetail?.dateCreated
              ? new Date(postDetail.dateCreated).toDateString()
              : ""}
          </span>
        </div>

        <div className="d-flex align-items-center gap-1">
          <BsEye />
          <span>100</span>
        </div>
      </div>
      {/* Post */}
      {postDetail && (
        <>
          <div className="row justify-content-center">
            <div className="flex-grow-1 px-5">
              {/* Cover Image */}
              {postDetail.coverImage && (
                <div>
                  <img
                    className="w-100 rounded-4 border border-1"
                    src={postDetail.coverImage}
                    alt={postDetail.name}
                    style={{
                      display: "block",
                      height: "auto",
                    }}
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="fw-bold ">{postDetail.name}</h2>

              {/* Tags */}
              {postDetail.listTag?.length > 0 && (
                <div className="mb-4">
                  {postDetail.listTag.map((tag) => (
                    <span
                      key={tag.slug}
                      className="badge bg-light text-primary me-2"
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
                  __html: postDetail.content?.replace(
                    /<img /g,
                    '<img class="img-fluid rounded mx-auto d-block" ',
                  ),
                }}
              ></div>

              {/* Source */}
              {postDetail.source && (
                <p className="mt-4 text-muted">
                  <strong>Source:</strong> {postDetail.source}
                </p>
              )}
            </div>
          </div>
        </>
      )}
      <div className="d-flex flex-row align-items-center gap-2 px-3">
        <span>Share:</span>

        <button className="btn btn-sm btn-outline-primary fw-bold d-flex justify-content-between align-items-center gap-1">
          <BsFacebook />
          Facebook
        </button>

        <button className="btn btn-sm btn-outline-primary fw-bold d-flex justify-content-between align-items-center gap-1">
          <BsTwitter />
          Twitter
        </button>
        <button className="btn btn-sm btn-outline-primary fw-bold d-flex justify-content-between align-items-center gap-1">
          <BsLinkedin />
          Linkedin
        </button>
      </div>
      <div>
        <div className="d-flex justify-content-center align-items-center gap-2">
          <BsNewspaper color="blue" width={32} />
          <h4 className="text-center ">Related Post</h4>
        </div>
        
      </div>
    </div>
  );
}
