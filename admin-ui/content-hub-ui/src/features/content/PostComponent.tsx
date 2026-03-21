import { useEffect, useRef, useState } from "react";
import { postApi, type PostResponse } from "../../api/content/post.api";
import { PostList } from "./../../pages/content/PostForUserUI/PostForUserUI";

export default function PostPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 1;

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await postApi.getPost(page, pageSize);
      const newPosts = res.data.results || [];

      setPosts((prev) => [...prev, ...newPosts]);

      if (newPosts.length < pageSize) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // load lần đầu
  useEffect(() => {
    fetchPosts();
  }, []);

  // intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [page, loading, hasMore]);

  return (
    <div className="container">
      <PostList posts={posts} />


      <div ref={loadMoreRef} className="text-center my-4">
        {loading && <div className="spinner-border text-primary"></div>}
        {!hasMore && (
          <p className="text-muted">No more posts</p>
        )}
      </div>
    </div>
  );
}