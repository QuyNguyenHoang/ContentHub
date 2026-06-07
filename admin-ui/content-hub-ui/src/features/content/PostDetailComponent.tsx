import { PostDetail } from "../../pages/content/PostForUserUI/PostDetail";
import Comment from "../../features/content/CommentComponent";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import {
  cilCommentBubble,
  cilHappy,
  cilHeart,
  cilOptions,
  cilPin,
  cilSad,
  cilSmile,
  cilSync,
  cilThumbDown,
  cilThumbUp,
  cilWarning,
} from "@coreui/icons";
import { postApi, type PostDetailResponse } from "../../api/content/post.api";

export default function PostDetailPage() {
  const location = useLocation();
  const [action, setAction] = useState(false);
  useEffect(() => {
    if (location.hash === "#comments") {
      setTimeout(() => {
        const el = document.getElementById("comments");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }, [location]);
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const postId = slug ? slug.slice(-36) : null;
  const getPostById = async () => {
    try {
      if (!postId) return;

      setLoading(true);
      const res = await postApi.getById(postId);
      setPostDetail(res.data);
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
    <div className="container-fluid">
      <div className="row">
        {/* LEFT FIXED BAR */}
        <div className="d-none d-md-block col-md-1 col-lg-1">
          <div
            style={{
              position: "fixed",
              top: "100px",
              left: 0,
              width: "80px",
              height: "100vh",
              zIndex: 10,
            }}
          >
            <div className=" d-flex flex-column align-items-center pt-3 position-relative">
              {/* REACTION BUTTON */}
              <button
                className="btn btn-light mb-2 d-flex flex-column align-items-center position-relative"
                onClick={() => setAction((prev) => !prev)}
              >
                {/* ICON + */}
                <div className="position-relative">
                  <CIcon icon={cilHeart} />
                </div>

                <small>120</small>
              </button>

              {/* REACTION PANEL */}
              {action && (
                <div
                  className="bg-white border rounded shadow-sm p-2 position-absolute"
                  style={{
                    left: "85px",
                    top: "0",
                    zIndex: 20,
                    borderRadius: "999px",
                  }}
                >
                  <div className="d-flex align-items-center gap-1">
                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilThumbUp} size="sm" />
                    </button>

                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilHeart} size="sm" />
                    </button>

                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilHappy} size="sm" />
                    </button>

                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilSmile} size="sm" />
                    </button>

                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilSad} size="sm" />
                    </button>

                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilWarning} size="sm" />
                    </button>

                    <button
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <CIcon icon={cilThumbDown} size="sm" />
                    </button>
                  </div>
                </div>
              )}
              {/* Comment */}
              <button
                className="btn btn-light d-flex flex-column mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  document.getElementById("comments")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <CIcon icon={cilCommentBubble} />
                <small>0</small>
              </button>

              {/* SAVE */}
              <button className="btn btn-light d-flex flex-column mb-2">
                <CIcon icon={cilPin} />
                <small>10</small>
              </button>

              <button className="btn btn-light d-flex flex-column mb-2">
                <CIcon icon={cilSync} />
              </button>

              <button className="btn btn-light d-flex flex-column mb-2">
                <CIcon icon={cilOptions} />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-12 col-md-8 col-lg-8">
          <div>
            {/* POST */}
            <div className="bg-white rounded shadow-sm">
              <PostDetail postDetail={postDetail} loading={loading} />
            </div>

            {/* COMMENT */}
            <div
              id="comments"
              className="mt-4 p-3 border border-2 rounded bg-light shadow-sm"
              style={{ scrollMarginTop: "100px" }}
            >
              <h3 className="text-center">Comment</h3>
              <Comment />
            </div>
          </div>
        </div>
        {/* RIGHT NAV */}
        <div className=" d-none d-md-block col-md-3 col-lg-3 bg-white  rounded-2 p-0">
          <div
            style={{
              position: "sticky",
              top: "60px",
              maxHeight: "calc(100vh - 60px)",
              overflowY: "auto",
            }}
          >
            <div
              className=" card p-3 vh-100 shadow-lg mb-3"
              style={{ maxHeight: "300px" }}
            >
              {/* Author */}
              <div>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={
                      postDetail?.authorAvatar ? postDetail.authorAvatar : ""
                    }
                    className="rounded-circle"
                    width={48}
                    height={48}
                  />
                  <span>{postDetail?.authorName}</span>
                </div>
                <div className="flex-grow-1 px-5">
                  <button className="btn btn-primary w-100">Follow</button>
                </div>
              </div>
            </div>
            <div
              className="card vh-100 shadow-lg px-2"
              style={{ maxHeight: "400px" }}
            >
              <h4 className="text-center text-danger blink-text mt-4">HOT</h4>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="d-md-none position-fixed bg-secondary bottom-0 start-0 w-100 border-top p-3 ">
        <div className="d-flex justify-content-around">
          <span>🏠</span>
          <span>🔍</span>
          <span>👤</span>
        </div>
      </div>
    </div>
  );
}
