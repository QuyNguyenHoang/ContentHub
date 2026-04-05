import { PostDetail } from "../../pages/content/PostForUserUI/PostDetail";
import Comment from "../../features/content/CommentComponent";

export default function PostDetailPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <PostDetail />
        </div>
        <div className="col-12 p-4 border border-2 rounded-2 bg-light rounded-lg min-vh-100 shadow-lg">
          <h3 className="text-center">Comment</h3>
          <div className="min-vh-10 bg-black">

          </div>
          <Comment commentResponse={[]} />
        </div>
      </div>
    </div>
  );
}