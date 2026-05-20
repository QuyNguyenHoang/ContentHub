import { useCallback, useEffect, useState } from "react";
import {
  postActivityLogApi,
  type PostActivityLogResponse,
} from "../../api/content/postActivityLog.api";
import PostActivityLogTable from "../../pages/content/PostActivityLogs/PostActivityLogTable";
interface Props {
  postId: string;
}
export default function PostActivityLogManagement({ postId }: Props) {
  const [postActivityLog, setPostActivityLog] = useState<
    PostActivityLogResponse[]
  >([]);
  const [loading, setLoading] = useState(false);

  const loadPostActivityLog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postActivityLogApi.getPostActivityLog(postId);
      const data = res.data;
      setPostActivityLog(data);
    } catch (error) {
      console.error("Load activity log failed:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);
  useEffect(() => {
    loadPostActivityLog();
  }, [postId]);

  return (
    <div className="container">
      {loading ? (
        <div className="text-center text-sm">
          <div className="spinner-border text-success"></div>
        </div>
      ) : (
        <PostActivityLogTable postActivityLog={postActivityLog} />
      )}
    </div>
  );
}
