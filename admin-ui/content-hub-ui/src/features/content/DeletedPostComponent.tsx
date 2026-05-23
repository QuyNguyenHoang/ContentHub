import { useCallback, useEffect, useState } from "react";
import { postApi, type PostResponse } from "../../api/content/post.api";
import DeletedPostTable from "../../pages/content/PostUI/DeletedPostTable";
import Toast from "../../components/common/Toast";

interface Props {}
export default function DeletedPosts({}: Props) {
  const [deletedPost, setDeletedPost] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  //Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  const pageSize = 2;
  //load deleted post
  const loadDeletedPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postApi.listPostDeleted({
        filter,
        keyword,
        pageNumber,
        pageSize,
      });
      const data = res.data.results;
      setDeletedPost(data);
    } catch (error) {
      console.log(error, "Load deleted post faild!!!");
    } finally {
      setLoading(false);
    }
  }, [filter, keyword, pageNumber, pageSize]);
  useEffect(() => {
    loadDeletedPosts();
  }, [loadDeletedPosts]);
  //Restore deleted post
  const handleRestore = async (ids: string[]) => {
    try {
      setLoading(true);
      const data = await postApi.restoreDeletedPost(ids);

      showAlert(`Restore ${data} items is successfully!`, "success");
    } catch (error) {
      console.log(error, "Restore post failed!!!");
    }
    finally{
        setLoading(false);
    }
  };
  return (
    <div className="container">
      {loading ? (
        <div className="spinner-border text-primary"></div>
      ) : (
        <DeletedPostTable 
        deletedPost={deletedPost} 
        handleRestore = {handleRestore}
        />
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
