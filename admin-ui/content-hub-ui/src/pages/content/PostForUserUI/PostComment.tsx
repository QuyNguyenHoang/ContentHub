import { useEffect, useRef, useState } from "react";
import type { CommentResponse } from "../../../api/content/comment.api";
import CommentItem from "../../../pages/content/PostForUserUI/CommentItem"
interface Props { 
  comments: CommentResponse[];
  onSend: () => void;
  onReply: (parentId: string, content: string) => void;
}

export default function PostComment({ comments, onReply }: Props) {
  const [repliesId, setRepliesId] = useState<string | null>(null);
  const repliesBoxRef = useRef<HTMLDivElement>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        repliesBoxRef.current &&
        !repliesBoxRef.current.contains(event.target as Node)
      ) {
        setRepliesId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log("parentId =", repliesId);

  return (
    <div className="mt-3">
      {comments.length === 0 ? (
        <p className="text-center text-muted">No comments yet</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="card mb-3 shadow-sm border-0 rounded-3">
            <div className="card-body d-flex gap-3">
              {/* Avatar */}
              <img
                src={
                  c.avatar ||
                  "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775028937/penguin_qkob1d.jpg"
                }
                alt="avatar"
                className="rounded-circle"
                style={{ width: 40, height: 40, objectFit: "cover" }}
              />

              {/* Content */}
              <div className="flex-grow-1">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{c.author || "Anonymous"}</strong>
                  <small className="text-muted">
                    {new Date(c.dateCreated).toLocaleString()}
                  </small>
                </div>

                {/* Text */}
                <p className="mb-1 mt-1">{c.content}</p>

                {/* Actions */}
                <div className="d-flex gap-3">
                  <button className="btn btn-sm btn-link p-0 text-decoration-none">
                    👍 Like
                  </button>
                  <button
                    className="btn btn-sm btn-link p-0 text-decoration-none"
                    onClick={() => {
                      setRepliesId(c.id);
                    }}
                  >
                    💬 Reply
                  </button>
                </div>
              </div>
            </div>
          
            {/* Replies */}
            {repliesId === c.id && (
              <div className="form-floating p-5" ref={repliesBoxRef}>
                <textarea
                  onChange={(e) => setReplyContent(e.target.value)}
                  name="repliesAreas"
                  className="form-control "
                  id="floatingTextarea"
                  style={{ minHeight: 100 }}
                ></textarea>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary rounded-3 me-1"
                    onClick={() => onReply(c.id, replyContent)}
                  >
                    Submid
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger rounded-3"
                    onClick={() => setRepliesId(null)}
                  >
                    Cancle
                  </button>
                </div>

                <label className="floatingTextarea ps-5">
                  Replies for {c.author}
                </label>
              </div>
            )}
          {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onReply={onReply} />
      ))}
          </div>

        ))
      )}
    </div>
  );
}
