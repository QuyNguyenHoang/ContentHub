import { useEffect, useRef, useState } from "react";
import type { CommentResponse } from "../../../api/content/comment.api";
import CIcon from "@coreui/icons-react";
import { cilOptions, cilPencil, cilThumbUp, cilTrash } from "@coreui/icons";
import useClickOutside from "../../../components/hooks/clickOutSide";
interface Props {
  comments: CommentResponse[];
  onSend: () => void;
  onReply: (parentId: string, content: string, depth: number) => void;
  onDelete: (id:string) => void;
}

export default function PostComment({ comments, onReply, onDelete }: Props) {
  const [repliesId, setRepliesId] = useState<string | null>(null);
  const repliesBoxRef = useRef<HTMLDivElement>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const [likeComment, setLikeComment] = useState<Record<string, boolean>>({});

  const [openOptionId, setOpenOptionId] = useState<string | null>(null);
  const handleOption = (commentId: string) => {
    setOpenOptionId((prev) => (prev === commentId ? null : commentId));
  };
  const handleLike = (commentId: string) => {
    setLikeComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useClickOutside(repliesBoxRef,()=>{
    setRepliesId(null);
    setOpenOptionId(null);
  });
  const toggleReply = (id: string) => {
    setOpenReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log("parentId =", repliesId);

  const getDepth = (comment: CommentResponse) => {
    if (!comment.parentId) return 1;
    if (comment.depth === 1) {
      console.log("return 2", comment.depth);
      return 2;
    }

    return 2;
  };
  const getParentId = (comment: CommentResponse) => {
    if (!comment.parentId) return comment.id;

    if (comment.depth === 1) return comment.id;
    return comment.parentId;
  };
  const renderChildren = (children: CommentResponse[]) => {
    return children.map((child) => (
      <div key={child.id} className="ms-5">
        <div className="card border-0">
          <div className="card-body d-flex">
            <img
              src={
                child.avatar ||
                "https://res.cloudinary.com/dg2ztzhrt/image/upload/v1775028937/penguin_qkob1d.jpg"
              }
              className="rounded-circle"
              style={{ width: 32, height: 32 }}
            />

            <div className="flex-grow-1">
              <div className="d-flex justify-content-start align-items-center gap-2">
                <strong>{child.author}</strong>
                <small className="text-muted">
                  {new Date(child.dateCreated).toLocaleString()}
                </small>
              </div>

              <p className="mb-1">{child.content}</p>

              <button
                className="btn btn-sm btn-link p-0 text-decoration-none"
                onClick={() => {
                  setRepliesId(child.id);
                }}
              >
                💬 Reply
              </button>
              {/* Replies */}
              {repliesId === child.id && (
                <div className="form-floating p-5" ref={repliesBoxRef}>
                  <textarea
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [child.id]: e.target.value,
                      }))
                    }
                    name="repliesAreas"
                    className="form-control "
                    id="floatingTextarea"
                    style={{ minHeight: 100 }}
                  ></textarea>
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary rounded-3 me-1"
                      onClick={() => {
                        onReply(
                          getParentId(child),
                          replyContent[child.id],
                          getDepth(child),
                        );
                        setRepliesId(null);
                      }}
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
                    Replies for {child.author}
                  </label>
                </div>
              )}
            </div>
            <div className="dropdown position-relative">
              <button
                className="btn btn-sm btn-link "
                onClick={() => handleOption(child.id)}
              >
                <CIcon icon={cilOptions} title="Options" />
              </button>
              {/* options */}
              {openOptionId === child.id && (
                <ul className="dropdown-menu show position-absolute end-0">
                  <li>
                    <a className="dropdown-item" href="#">
                      Edit
                      <CIcon
                        icon={cilPencil}
                        width={16}
                        height={16}
                        className="ms-2"
                      />
                    </a>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={()=> onDelete(child.id)}>
                      Delete
                      <CIcon
                        icon={cilTrash}
                        width={16}
                        height={16}
                        className="ms-2"
                      />
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Replies for replied*/}
        {child.children && child.children.length > 0 && (
          <>
            <button
              className="btn btn-sm btn-link p-0 text-decoration-none ms-5"
              onClick={() => toggleReply(child.id)}
            >
              {openReplies[child.id]
                ? "Hide replies"
                : `See replies (${child.children.length})`}
            </button>

            {openReplies[child.id] && (
              <div className="ms-4">{renderChildren(child.children)}</div>
            )}
          </>
        )}
      </div>
    ));
  };
  return (
    <div className="mt-3">
      {comments.length === 0 ? (
        <p className="text-center text-muted">No comments yet</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="card shadow-sm border-0 rounded-3">
            <div className="card-body d-flex gap-2">
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
                  <div className="d-flex justify-content-start align-items-center gap-2">
                    <strong>{c.author || "Anonymous"}</strong>
                    <small className="text-muted">
                      {new Date(c.dateCreated).toLocaleString()}
                    </small>
                  </div>
                  <div className="dropdown position-relative">
                    <button
                      className="btn btn-sm btn-link "
                      onClick={() => handleOption(c.id)}
                    >
                      <CIcon icon={cilOptions} title="Options" />
                    </button>
                    {/* options */}
                    {openOptionId === c.id && (
                      <ul className="dropdown-menu show position-absolute end-0">
                        <li>
                          <a className="dropdown-item" href="#">
                            Edit
                            <CIcon
                              icon={cilPencil}
                              width={16}
                              height={16}
                              className="ms-2"
                            />
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Delete
                            <CIcon
                              icon={cilTrash}
                              width={16}
                              height={16}
                              className="ms-2"
                            />
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* Text */}
                <p className="mb-1 mt-1">{c.content}</p>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm fw-bold ${likeComment[c.id] ? "text-primary" : "text-black"} `}
                    onClick={() => handleLike(c.id)}
                  >
                    <CIcon icon={cilThumbUp} />
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
                {/* Replies */}
                {repliesId === c.id && (
                  <div className="form-floating p-5" ref={repliesBoxRef}>
                    <textarea
                      onChange={(e) =>
                        setReplyContent((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                      name="repliesAreas"
                      className="form-control "
                      id="floatingTextarea"
                      style={{ minHeight: 100 }}
                    ></textarea>
                    <div className="d-flex justify-content-end mt-2">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-3 me-1"
                        onClick={() => {
                          onReply(c.id, replyContent[c.id], 1);
                          toggleReply(c.id);
                          setRepliesId(null);
                        }}
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
              </div>
            </div>

            {c.children && c.children.length > 0 && (
              <div className="d-flex justify-content-between align-items-center ms-5">
                <button
                  className="btn btn-sm btn-link text-decoration-none "
                  onClick={() => toggleReply(c.id)}
                >
                  {openReplies[c.id]
                    ? "Hide replies"
                    : `View (${c.children.length}) replied`}
                </button>
              </div>
            )}
            {openReplies[c.id] && c.children && c.children.length > 0 && (
              <div className="ms-4">{renderChildren(c.children)}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
