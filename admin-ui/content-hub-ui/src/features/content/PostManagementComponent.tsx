import { useCallback, useEffect, useState } from "react";
import {
  postApi,
  type PostDetailResponse,
  type PostResponse,
} from "./../../api/content/post.api";
import PostTable from "../../pages/content/PostUI/PostTable";
import SearchBox from "../../components/common/SearchBox";
import Paging from "../../components/common/PagingComponent";
import CIcon from "@coreui/icons-react";
import { cilFilter, cilTrash } from "@coreui/icons";
import Toast from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import DeletedPost from "../../pages/content/PostUI/DeletedPost";
import PostDetail from "../../pages/content/PostUI/PostDetail";

export const POST_STATUS = {
  DRAFT: "Draft",
  PENDING: "Pending",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
} as const;
export const POST_STATUS_OPTIONS = Object.values(POST_STATUS);
export default function PostManagement() {
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 10;
  const [filter, setFilter] = useState("");
  //state modal detail post
  const [showPostDetail, setShowPostDetail] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  //state modal deleted post
  const [showDeletedPost, setShowDeletedPost] = useState(false);
  //Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  //Load post detail
  const loadPostById = async () => {
    try {
      setLoading(true);
      if (showPostDetail) {
        const res = await postApi.getById(showPostDetail);
        setPostDetail(res.data);
      }
    } catch (error) {
      console.log(error, "load post detail faild!!!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (showPostDetail) {
      document.body.style.overflow = "hidden";
      loadPostById();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPostDetail]);
  //Total posts
  const [totalPosts, setTotalPosts] = useState(0);
  const handleTotalPosts = async () => {
    try {
      const res = await postApi.totalPosts();

      setTotalPosts(res.data);
    } catch (error) {
      console.log(error, "Get total post failed");
    }
  };
  useEffect(() => {
    handleTotalPosts();
  }, [handleTotalPosts]);

  //filter
  const handleFilterChange = (value: string) => {
    setFilter(value === "All" ? "" : value);
    setPageNumber(1);
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
      setShowPostDetail(null);
      showAlert("Approve post is successfully!", "success");
    } catch (error) {
      console.log("Approve faild", error);
      showAlert("Approve Post is faild!!!", "danger");
    } finally {
      setLoading(false);
    }
  };
  //Reject Post
  const handleReject = async (postId: string) => {
    try {
      setLoading(true);
      await postApi.rejectPost(postId);
      setPost((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, status: POST_STATUS.REJECTED } : p,
        ),
      );
      setShowPostDetail(null);
      showAlert("Rejected Post is successfull", "success");
    } catch (error) {
      console.log("Call api was failed");
      showAlert("Rejected Post is failed!!!", "success");
    } finally {
      setLoading(false);
    }
  };
  //Delete Post
  const [selectPostIds, setSelectPostIds] = useState<string[]>([]);
  const countPost = selectPostIds.length;
  //Delele post method
  const handleDeletePosts = async (ids: string[]) => {
    if (countPost <= 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${countPost} items post`,
    );
    if (confirmDelete) {
      try {
        setLoading(true);
        await postApi.deletePosts(ids, false);
        showAlert(`Successfully deleted ${ids.length} posts!`, "success");
        if (post.length === ids.length && pageNumber > 1) {
          setPageNumber((prev) => prev - 1);
        } else {
          await loadPosts();
        }

        setSelectPostIds([]);
      } catch (error) {
        console.log(error, `Can not delete post with id = ${ids}`);
      } finally {
        setLoading(false);
      }
    }
  };

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
  // Reset page
  useEffect(() => {
    setPageNumber(1);
  }, [filter]);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postApi.getPostByAdmin(
        keyword,
        filter,
        pageNumber,
        pageSize,
        true,
      );
      const data = res.data;
      

      setPageCount(data.pageCount);
      setPost(data.results);

    } catch (erorr) {
      console.log("Fetch post faild", erorr);
    } finally {
      setLoading(false);
      setSelectPostIds([]);
    }
  }, [keyword, filter, pageNumber, pageSize]);
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);
  return (
    <div className="container d-flex flex-column min-vh-100">
      <h3 className="text-center fw-bold p-2">Posts Management</h3>
      <SearchBox
        placeholder="Search post ..."
        keyword={keyword}
        onChangeKeyword={(value) => {
          setKeyword(value);
          setPageNumber(1);
        }}
        loadData={loadPosts}
      />
      {/* Recycle Bin Areas  */}
      <div className="d-flex justify-content-end align-items-center">
        <button className="btn btn-sm" onClick={() => setShowDeletedPost(true)}>
          <CIcon icon={cilTrash} size="sm" title="Recycle Bin" />
        </button>
      </div>
      {/* filter areas */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 pt-3">
        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          <div>
            <h4 className="fw-bold ">Total Post ({totalPosts})</h4>
          </div>
          {/* delete button */}
          {countPost > 0 && (
            <div className="">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeletePosts(selectPostIds)}
              >
                <CIcon icon={cilTrash} size="sm" />
                Delete ({countPost}) Post{countPost === 1 ? "" : "s"}
              </button>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          <div
            className="input-group input-group-sm  mb-2"
           
          >
            <span className="input-group-text">
              <CIcon icon={cilFilter} />
            </span>

            <select
              value={filter}
              className="form-select auto"
              onChange={(e) => {
                setFilter(e.target.value);
                handleFilterChange(e.target.value);
              }}
            >
              <option value="All">All</option>

              {POST_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {/* New button */}
          <div className="mb-2">
            <button
              className="btn btn-sm btn-outline-success rounded-2 fw-bold text-nowrap"
              onClick={() => navigate("/new")}
            >
              + New Post
            </button>
          </div>
        </div>

      </div>
      {/* Content */}
      <div className="flex-grow-1">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary small"></div>
          </div>
        ) : (
          <div>
            <PostTable
              post={post}
              selectPostIds={selectPostIds}
              handleToggleSelectPost={handleToggleSelectPost}
              handleToggleSelectAllPost={handleToggleSelectAllPost}
              handleApprove={handleApprove}
              handleReject={handleReject}
              setShowPostDetail={setShowPostDetail}
            />
          </div>
        )}
      </div>

      {/* Paging */}
      <div className="mb-4">
        <Paging
          currentPage={pageNumber}
          totalPages={pageCount}
          onPageChange={setPageNumber}
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
      {/* Deleted post list */}
      <div>
        <DeletedPost
          showDeletedPost={showDeletedPost}
          setShowDeletedPost={setShowDeletedPost}
          loadPosts={loadPosts}
        />
      </div>
      {/* Post Detail */}
      <div>
        <PostDetail
          postDetail={postDetail}
          showPostDetail={showPostDetail}
          setShowPostDetail={setShowPostDetail}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      </div>
    </div>
  );
}
