import { BsCalendar, BsEye, BsFire } from "react-icons/bs";
import type { PostResponse } from "../../../api/content/post.api";
import { Link } from "react-router-dom";

interface Props{
  posts:PostResponse[] | null;
  postByViewCount:PostResponse[] | [];
 }

export function PostSideBar({
  postByViewCount,
}:Props) {
  return (
    <div>
      {/* Collapse đơn giản: desktop luôn hiện, mobile ẩn */}
      <div className="collapse d-lg-block" id="sidebarHot">
        <div
          className="bg-white rounded-4 border-0 shadow-lg p-3"
          style={{maxHeight:"1000px"}}
        >
          {/* Tiêu đề HOT */}
          <div className="d-flex justify-content-center align-items-center gap-2 p-3 text-danger">
            <BsFire size={24} />
            <h5 className="m-0">POPULAR POSTS</h5>
          </div>

          {postByViewCount?.map((p) => {
            return (
              <div
                className="d-flex flex-row align-items-center border-bottom border-2"
                key={p.id}
              >
                <div className="m-2">
                  <img
                    src={
                      p.coverImage
                        ? p.coverImage
                        : "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775317449/contenthub_image/tfypgnrexftyhtdw5yzw.jpg"
                    }
                    width={56}
                    height={56}
                    style={{ display: "block" }}
                    className="rounded-2"
                  />
                </div>
                <div className="d-flex flex-column ms-1 small">
                  <Link
                    to={`/posts/${p.slug} - ${p.id}`}
                    className="small text-truncate text-dark fw-bold text-decoration-none link-primary"
                    style={{
                      maxWidth: "300px",
                    }}
                  >
                    {p.name}
                  </Link>
                  <span>
                    <BsCalendar className="me-1" />
                    {p.dateCreated
                      ? new Date(p.dateCreated).toDateString()
                      : ""}
                  </span>
                  <div className="d-flex align-items-center gap-1">
                    <BsEye />
                    <span>{p.viewCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
