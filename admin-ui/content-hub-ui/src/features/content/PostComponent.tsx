import { useEffect, useRef, useState, useCallback } from "react";
import { postApi, type PostResponse } from "../../api/content/post.api";
import { PostList } from "../../pages/content/PostForUserUI/PostListForUser";
import { PostComposer } from "../../pages/content/PostForUserUI/PostComposer";
import { PostSideBar } from "../../pages/content/PostForUserUI/PostSideBar";

export default function PostPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasFetched = useRef(false);

  const pageSize = 5;
  const keyword = "";
  const filter = "";

  // 🔥 Fetch API chuẩn (không stale state)
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await postApi.getPost(keyword, filter, page, pageSize);
      const newPosts = res.data.results || [];

      // merge + remove duplicate
      setPosts((prev) => {
        const merged = [...prev, ...newPosts];
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((p) => p.id === item.id)
        );
      });

      // check còn dữ liệu không
      if (newPosts.length < pageSize) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // 🔥 Load lần đầu (fix StrictMode)
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchPosts();
  }, [fetchPosts]);

  // 🔥 Infinite scroll chuẩn
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && !loading && hasMore) {
          fetchPosts();
        }
      },
      {
        rootMargin: "200px", // load sớm
      }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [fetchPosts, loading, hasMore]);

  return (
    <div className="container">
      <div className="row g-5">

        {/* LEFT CONTENT */}
        <div className="col-lg-9">
          <PostComposer />
          <PostList posts={posts} />
        </div>

        {/* RIGHT SIDEBAR */}
        <PostSideBar />
      </div>

      {/* LOAD MORE */}
      <div ref={loadMoreRef} className="text-center my-4">
        {loading && <div className="spinner-border text-primary"></div>}
        {!hasMore && <p className="text-muted">No more posts</p>}
      </div>
    </div>
  );
}