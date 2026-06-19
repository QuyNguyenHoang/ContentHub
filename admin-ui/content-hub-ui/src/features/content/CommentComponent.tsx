import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PostComment from "../../pages/content/PostForUserUI/PostComment";
import {
  commentApi,
  type CommentResponse,
} from "../../api/content/comment.api";
import CIcon from "@coreui/icons-react";
import { cilCheck, cilSwapVertical } from "@coreui/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../components/layouts/store/store";

export default function Comment() {
  const { user } = useSelector((state: RootState) => state.auth);
  const authId = user?.userId;
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [filterBox, setFilter] = useState("all");
  const [hasMore, setHasMore] = useState(true);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [totalComments, setTotalComments] = useState(0);
  const commentBoxRef = useRef<HTMLDivElement>(null);

  const [commentBox, setCommentBox] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  //paged
  const pageSize = 2;
  const { slug } = useParams();
  const postId = slug ? slug.slice(-36) : null;

  //Delete
  const handleDelete = async (id: string) => {
    try {
      await commentApi.deleteComment(id);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const userInf = DecodeToken.accessToken();
  //   const userId = userInf?.userId;
  //   if (!userId) {
  //     navigate("/login");
  //   }
  //   setAuthId(userId || null);
  // }, [navigate]);

  const mergeComments = (
    prev: CommentResponse[],
    newComments: CommentResponse[],
  ): CommentResponse[] => {
    // hàm insert vào tree
    const insertReply = (
      list: CommentResponse[],
      comment: CommentResponse,
    ): CommentResponse[] => {
      if (!comment.parentId) {
        return [comment, ...list];
      }

      return list.map((item) => {
        if (item.id === comment.parentId) {
          return {
            ...item,
            children: [...(item.children || []), comment],
          };
        }

        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: insertReply(item.children, comment),
          };
        }

        return item;
      });
    };

    let result = [...prev];

    newComments.forEach((comment) => {
      const exists = (list: CommentResponse[]): boolean => {
        return list.some((item) => {
          if (item.id === comment.id) return true;
          if (item.children) return exists(item.children);
          return false;
        });
      };

      if (!exists(result)) {
        result = insertReply(result, comment);
      }
    });

    return result;
  };

  //click outside commentbox
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        commentBoxRef.current &&
        !commentBoxRef.current.contains(event.target as Node)
      ) {
        setCommentBox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnect = async () => {
    if (!postId) return;

    try {
      // tránh tạo nhiều connection
      if (connection) return;

      const HUB_URL = import.meta.env.VITE_API_URL + "/hubs/comments";

      const conn = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL)
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .build();

      // listen trước khi start
      conn.on("ReceiveComment", (comment) => {
        setComments((prev) => mergeComments(prev, [comment]));
      });

      conn.onreconnecting(() => {
        console.log("Reconnecting...");
      });

      conn.onreconnected(async () => {
        console.log("Reconnected");
        await conn.invoke("JoinPost", postId);
      });

      conn.onclose(() => {
        console.log("Connection closed");
      });

      await conn.start();
      console.log("connected");

      await conn.invoke("JoinPost", postId);

      setConnection(conn);
    } catch (error) {
      console.log("Connect fail:", error);
    }
  };
  useEffect(() => {
    handleConnect();
  }, [postId]);

  useEffect(() => {
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  const handleReply = async (
    parentId: string,
    content: string,
    depth: number,
  ) => {
    if (!content || !authId || !postId || !parentId) return;

    try {
      await commentApi.createReply({
        content,
        authId,
        postId,
        depth,
        parentId,
      });
      setTotalComments((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSend = async () => {
    if (!content || !authId || !postId) return;
    try {
      await commentApi.createComment({ content, authId, postId });
      console.log(content);
      setContent("");
      setTotalComments((prev) => prev + 1);
    } catch (error) {
      console.log("Sending error", error);
    }
  };

  // fetch data
  useEffect(() => {
    if (!postId) return;
    getComment();
  }, [pageNumber, postId, filterBox]);
  //get Api Comment
  const getComment = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      if (!postId) return;
      const res = await commentApi.getCommentPaged({
        postId,
        filter: filterBox,
        pageNumber,
        pageSize,
      });
      const commentData = res.data.results || [];
      const total = res.data.rowCount;
      setTotalComments(total);

      setComments((prev) => {
        const merged = mergeComments(prev, commentData);

        if (merged.length >= total) {
          setHasMore(false);
        }

        return merged;
      });
    } catch (erorr) {
      console.log("Server error", erorr);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, loading, hasMore, postId, filterBox, pageSize]);
  // reset data
  useEffect(() => {
    setComments([]);
    setPageNumber(1);
    setHasMore(true);
  }, [filterBox, postId]);

  return (
    <div className="my-4">
      {/* filter   */}
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <h3 className="fw-bold  me-2">
            Top comment <span>({totalComments})</span>
          </h3>
          <div className="dropdown">
            <button
              className="btn btn-outline-primary rounded-2 d-flex align-items-center justify-content-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <CIcon icon={cilSwapVertical} width={20} height={20} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm p-1">
              <li>
                <button
                  className={`dropdown-item d-flex justify-content-between align-items-center rounded-2 ${
                    filterBox === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  <span>All comments</span>
                  {filterBox === "all" && (
                    <CIcon icon={cilCheck} width={16} height={16} />
                  )}
                </button>
              </li>

              <li>
                <button
                  className={`dropdown-item d-flex justify-content-between align-items-center rounded-2 ${
                    filterBox === "relevant" ? "active" : ""
                  }`}
                  onClick={() => setFilter("relevant")}
                >
                  <span className="me-1">Top comments</span>
                  {filterBox === "relevant" && (
                    <CIcon icon={cilCheck} width={16} height={16} />
                  )}
                </button>
              </li>

              <li>
                <button
                  className={`dropdown-item d-flex justify-content-between align-items-center rounded-2 ${
                    filterBox === "newest" ? "active" : ""
                  }`}
                  onClick={() => setFilter("newest")}
                >
                  <span>Newest</span>
                  {filterBox === "newest" && (
                    <CIcon icon={cilCheck} width={16} height={16} />
                  )}
                </button>
              </li>

              <li>
                <button
                  className={`dropdown-item d-flex justify-content-between align-items-center rounded-2 ${
                    filterBox === "oldest" ? "active" : ""
                  }`}
                  onClick={() => setFilter("oldest")}
                >
                  <span>Oldest</span>
                  {filterBox === "oldest" && (
                    <CIcon icon={cilCheck} width={16} height={16} />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div></div>
      </div>

      {/* Input comment */}
      {!commentBox && (
        <div
          className="d-flex align-items-center gap-2 p-2 border rounded-pill bg-white shadow-sm"
          role="button"
          onClick={() => setCommentBox(true)}
        >
          {/* Fake input */}
          <span className="text-muted flex-grow-1 ms-3">
            Write a comment...
          </span>
        </div>
      )}
      {commentBox && (
        <div
          className="mt-2 border border-primary rounded-3 p-3"
          ref={commentBoxRef}
          style={{ borderStyle: "dashed" }}
        >
          <div className="form-floating mt-3">
            <textarea
              className="form-control"
              id="floatingComment"
              placeholder="Leave a comment here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: 100 }}
            ></textarea>
            <label htmlFor="floatingComment">Enter your comment</label>
          </div>
          <div className="d-flex justify-content-end mt-2 gap-2">
            <button
              className="btn btn-sm btn-outline-primary rounded-3"
              onClick={handleSend}
            >
              Submit
            </button>
            <button
              className="btn btn-sm btn-outline-danger rounded-3"
              onClick={() => {
                setContent("");
                setCommentBox(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List comment */}
      <PostComment
        comments={comments}
        onSend={handleSend}
        onReply={handleReply}
        onDelete={(id) => handleDelete(id)}
      />

      {/* No more */}
      {hasMore && !loading && (
        <div className="text-center mt-3">
          <button
            disabled={loading}
            className="btn btn-primary rounded-2 px-4"
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Xem thêm
          </button>
        </div>
      )}

      {loading && (
        <div className="d-flex text-center mt-3 justify-content-center align-items-center">
          <div className="spinner-border text-primary me-2" role="status"></div>
          <span>Loading comments...</span>
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-muted mt-3">No more comments</p>
      )}

      {/* Load more trigger (infinite scroll) */}
      <div ref={loadMoreRef}></div>
    </div>
  );
}
