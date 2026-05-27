import { useCallback, useEffect, useState } from "react";
import { postApi, type PostResponse } from "../../api/content/post.api";
import DeletedPostTable from "../../pages/content/PostUI/DeletedPostTable";
import Toast from "../../components/common/Toast";
import Paging from "../../components/common/PagingComponent";
import SearchBox from "../../components/common/SearchBox";
import CIcon from "@coreui/icons-react";
import { cilFilter } from "@coreui/icons";

interface Props {
  loadPosts: () => void;
}
export default function DeletedPosts({ loadPosts }: Props) {
  const [deletedPost, setDeletedPost] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, settotalPage] = useState(1);
  //Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  const pageSize = 10;
  //Reset page
  useEffect(() => {
    setPageNumber(1);
  }, [filter]);
  //load deleted post
  const loadDeletedPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postApi.listPostDeleted({
        keyword,
        filter,
        pageNumber,
        pageSize,
      });
      const data = res.data;
      settotalPage(data.pageCount);
      setDeletedPost(data.results);
    } catch (error) {
      console.log(error, "Load deleted post faild!!!");
    } finally {
      setLoading(false);
    }
  }, [keyword, filter, pageNumber, pageSize]);
  useEffect(() => {
    loadDeletedPosts();
  }, [loadDeletedPosts]);
  //Restore deleted post
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  //Select 1 item
  const handleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  //Select toggle item
  const handleToggleSelected = () => {
    if (selectedIds.length === deletedPost.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(deletedPost.map((p) => p.id));
    }
  };
  //Delete permanently

  const handleDeletePermanently = async (ids: string[]) => {
    const confirmDeletePermanently = window.confirm(
      `Are you sure! You want to delete permanently (${ids.length}) item`,
    );
    if (confirmDeletePermanently) {
      try {
        setLoading(true);
        const res = await postApi.deletePosts(ids, true);
        const deleteCount = res.data
        showAlert(
          `Delete (${deleteCount}) item${deleteCount > 1 ? "s" : ""}`,
          "success",
        );
        await loadDeletedPosts();
        setSelectedIds([]);
      } catch (error) {
        console.log(error, `Delete ${ids.length} failed!!!`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (ids: string[]) => {
    try {
      setLoading(true);
      await postApi.restoreDeletedPost(ids);
      showAlert(`Restore ${ids.length} items is successfully!`, "success");
      setSelectedIds([]);
      await loadDeletedPosts();
      await loadPosts();
    } catch (error) {
      console.log(error, "Restore post failed!!!");
    } finally {
      setLoading(false);
    }
  };
  if (deletedPost.length === 0)
    return <h6 className="text-center">No deleted posts found</h6>;
  return (
    <div className="container">
      {/* Search */}
      <div className="mt-2">
      <SearchBox
        placeholder="Search for deleted post..."
        keyword={keyword}
        onChangeKeyword={(value) => {
          setKeyWord(value);
          setPageNumber(1);
        }}
        loadData={loadDeletedPosts}
      />
      </div>
      {/* Filter */}

      <div className="d-flex flex-column flex-lg-row  align-items-start align-items-lg-center">
        <div className="w-100">
          {selectedIds.length > 0 && (
            <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
              <button
                className="btn btn-sm btn-outline-success me-2 text-nowrap w-100"
                onClick={() => handleRestore(selectedIds)}
              >
                Restore ({selectedIds.length})
                {`item${selectedIds.length > 1 ? "s" : ""}`}
              </button>
              <button
                className="btn btn-sm btn-outline-danger text-nowrap w-100"
                title="Delete Permanently"
                onClick={() => handleDeletePermanently(selectedIds)}
              >
                Delete ({selectedIds.length})
                {`item${selectedIds.length > 1 ? "s" : ""}`}
              </button>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center w-100 ">
          <div
            className="input-group input-group-sm mb-2 ms-auto"
            style={{ maxWidth: "170px" }}
          >
            <span className="input-group-text">
              <CIcon icon={cilFilter} />
            </span>

            <select
              value={filter}
              className="form-select auto"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option value="date">Date</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner-border text-primary"></div>
      ) : (
        <>
          <DeletedPostTable
            deletedPost={deletedPost}
            selectedIds={selectedIds}
            handleRestore={handleRestore}
            handleSelected={handleSelected}
            handleToggleSelected={handleToggleSelected}
          />
          {/* Paging */}
          <Paging
            currentPage={pageNumber}
            totalPages={totalPage}
            onPageChange={setPageNumber}
          />
        </>
      )}

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
