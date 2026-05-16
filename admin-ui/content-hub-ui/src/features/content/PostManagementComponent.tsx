import { useCallback, useEffect, useState } from "react";
import { postApi, type PostResponse } from "./../../api/content/post.api";
import PostTable from "../../pages/content/PostUI/PostTable";
import SearchBox from "../../components/common/SearchBox";
export default function PostManagement() {
  const [post, setPost] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filter = "";

  //Delete Post
  const [selectPostIds, setSelectPostIds] = useState<string[]>([]);
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
    <div className="container">
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

      {loading && (
        <div className="spinner-border text-primary text-center small"></div>
      )}
      <PostTable
        post={post}
        selectPostIds={selectPostIds}
        handleToggleSelectPost={handleToggleSelectPost}
        handleToggleSelectAllPost={handleToggleSelectAllPost}
      />
    </div>
  );
}
