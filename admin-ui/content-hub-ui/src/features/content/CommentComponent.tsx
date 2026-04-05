import * as signalR from "@microsoft/signalr";
import { DecodeToken } from "../../api/extentions/decodeToken";
import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import PostComment from "../../pages/content/PostForUserUI/PostComment"
import {
  commentApi,
  type CommentResponse,
} from "../../api/content/comment.api";

interface Props {
  commentResponse: CommentResponse[];

}
export default function Comment({ commentResponse }: Props) {
  const [authId, setAuthId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentResponse[]>(
    commentResponse || [],
  );
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const navigate = useNavigate();
  const { slug } = useParams();
  const postId = slug ? slug.slice(-36) : null;
  console.log(postId);
  useEffect(() => {
    const userInf = DecodeToken.accessToken();
    const userId = userInf?.userId;
    if (!userId) {
      navigate("/login");
    }
    setAuthId(userId || null);
    console.log(userId);
  }, [navigate]);

  useEffect(() => {
    connectSignalR();
    return () => {
      connection?.stop();
    };
  }, []);
  const connectSignalR = async () => {
    if (!postId) {
      return;
    }
    const HUB_URL = import.meta.env.VITE_API_URL + "/hubs/comments";
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();
    await conn.start();
    console.log("connected");
    await conn.invoke("JoinPost", postId);
    conn.on("ReceiveComment", (comment: CommentResponse) => {
      console.log("RealTime", comment);
      setComments((prev) => [...prev, comment]);
    });
    setConnection(conn);
  };
  const handleSend = async () => {
    if (!content || !authId || !postId) return;
    try {
      await commentApi.createComment({ content, authId, postId });
    } catch (error) {
      console.log("Sending error", error);
    } finally {
      setContent("");
    }
  };
  return (
    <div>
      <PostComment commentResponse={comments} onSend={handleSend} />
    </div>
  );
}
