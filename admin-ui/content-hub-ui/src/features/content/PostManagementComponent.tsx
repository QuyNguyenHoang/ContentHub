import { useCallback, useEffect, useState } from "react";
import { postApi, type PostResponse } from "./../../api/content/post.api";
import PostTable from "../../pages/content/PostUI/PostTable";
import SearchBox from "../../components/common/SearchBox";
import Paging from "../../components/common/PagingComponent";
import CIcon from "@coreui/icons-react";
import { cilFilter, cilTrash } from "@coreui/icons";
import Toast from "../../components/common/Toast";

export const POST_STATUS = {
  DRAFT: "Draft",
  PENDING: "Pending",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
} as const;
export const POST_STATUS_OPTIONS = Object.values(POST_STATUS);
export default function PostManagement() {
  const [post, setPost] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 2;
  const [filter, setFilter] = useState("All");
  //Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  // Approve
  const handleApprove = async (postId: string) => {
    try {
      setLoading(true);

      await postApi.approvePost(postId);
      setPost((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, status: POST_STATUS.PUBLISHED } : p,
        ),
      );
      showAlert("Approve post is successfully!", "success");
    } catch (error) {
      console.log("Approve faild", error);
      showAlert("Approve Post is faild!!!", "danger");
    } finally {
      setLoading(false);
    }
  };
  //Delete Post
  const [selectPostIds, setSelectPostIds] = useState<string[]>([]);
  const countPost = selectPostIds.length;
  //Select row
  const handleToggleSelectPost = (id: string) => {
    setSelectPostIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  //Select All Post
  const handleToggleSelectAllPost = () => {
    if (selectPostIds.length === post.length) {
      setSelectPostIds([]);
    } else {
      setSelectPostIds(post.map((x) => x.id));
    }
  };

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postApi.getPostByAdmin(
        keyword,
        filter,
        page,
        pageSize,
        true,
      );
      const data = res.data.results || [];
      console.log("fetch data successful!");
      setPageCount(res.data.pageCount);
      setPost(data);
    } catch (erorr) {
      console.log("Fetch post faild", erorr);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, pageSize, filter]);
  useEffect(() => {
    loadPosts();
  }, [keyword, filter, page, pageSize]);
  return (
    <div className="container d-flex flex-column min-vh-100">
      <h3 className="text-center fw-bold p-2">Posts Management</h3>
      <SearchBox
        placeholder="Search post ..."
        keyword={keyword}
        loadData={loadPosts}
        onChangeKeyword={(value) => {
          setKeyword(value);
          setPage(1);
        }}
      />
      {/* filter areas */}
      <div className="d-flex justify-content-between align-items-center gap-2 pt-3">
        {/* delete button */}
        {countPost > 0 && (
          <div>
            <button className="btn btn-sm btn-outline-danger">
              <CIcon icon={cilTrash} size="sm" />
              Delete ({countPost}) Post{countPost === 1 ? "" : "s"}
            </button>
          </div>
        )}
        <div
          className="input-group input-group-sm mb-2 ms-auto"
          style={{ width: "170px" }}
        >
          <span className="input-group-text">
            <CIcon icon={cilFilter} />
          </span>

          <select
            className="form-select auto"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>

            {POST_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Content */}
      <div className="flex-grow-1">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary small"></div>
          </div>
        ) : (
          <div className="d-flex">
            <div className="flex-grow-1">
              <PostTable
                post={post}
                selectPostIds={selectPostIds}
                handleToggleSelectPost={handleToggleSelectPost}
                handleToggleSelectAllPost={handleToggleSelectAllPost}
                handleApprove={handleApprove}
              />
            </div>
          </div>
        )}
      </div>

      {/* Paging */}
      <div className="mb-4">
        <Paging
          currentPage={page}
          totalPages={pageCount}
          onPageChange={setPage}
        />
      </div>
      {/* Toast */}
      <div>
        <Toast
          showToast={showToast}
          message={message}
          alertColor={alertColor}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}
