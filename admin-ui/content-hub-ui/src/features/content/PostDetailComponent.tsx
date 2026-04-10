import { PostDetail } from "../../pages/content/PostForUserUI/PostDetail";
import Comment from "../../features/content/CommentComponent";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PostDetailPage() {
  const location = useLocation();

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
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <PostDetail />
        </div>
        <div
          className="col-12 p-4 border border-2 rounded-2 bg-light rounded-lg min-vh-100 shadow-lg"
          id="comments"
        >
          <h3 className="text-center">Comment</h3>

          <Comment />
        </div>
      </div>
    </div>
  );
}
