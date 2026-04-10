import { useEffect, useRef, useState } from "react";
import type { CommentResponse } from "../../../api/content/comment.api";

export default function CommentItem({
  comment,
  onReply,
}: {
  comment: CommentResponse;
  onReply: (parentId: string, content: string) => void;
}) {
  const [repliesId, setRepliesId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const repliesBoxRef = useRef<HTMLDivElement>(null);

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="card mb-2 border-0">
      <div className="card-body d-flex gap-3">
        <img
          src={
            comment.avatar ||
            "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775028937/penguin_qkob1d.jpg"
          }
          className="rounded-circle"
          style={{ width: 36, height: 36 }}
        />

        <div className="flex-grow-1">
          <strong>{comment.author}</strong>
          <p className="mb-1">{comment.content}</p>

          <button
            className="btn btn-sm btn-link p-0"
            onClick={() => setRepliesId(comment.id)}
          >
            Reply
          </button>
        </div>
      </div>

      {/* Reply box */}
      {repliesId === comment.id && (
        <div className="p-3" ref={repliesBoxRef}>
          <textarea
            className="form-control"
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="btn btn-sm btn-primary mt-2"
            onClick={() => onReply(comment.id, replyContent)}
          >
            Submit
          </button>
        </div>
      )}

      {/* 🔥 RENDER CHILDREN */}
      {comment.children && comment.children.length > 0 && (
        <div className="ms-5">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}