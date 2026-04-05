import type { CommentResponse } from "../../../api/content/comment.api";

interface Props {
  commentResponse: CommentResponse[];
  onSend: () => void;
}

export default function PostComment({ commentResponse }: Props) {
  return (
    <div>
      <div className="mt-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
           
        />
          <button className="btn btn-primary" >
            Send
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {commentResponse.map((c) => (
          <div
            key={c.author + c.dateCreated} // key unique
            className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg"
          >
            {/* Avatar giả, nếu có c.authorAvatar thì dùng */}
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
              {c.author?.[0] || "U"}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{c.author}</span>
              </div>
              <p className="text-gray-100 mt-1">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
