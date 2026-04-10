import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const API_URL = "https://localhost:7202/api/comments";
const HUB_URL = "https://localhost:7202/hubs/comments";

export default function RealtimeTest() {
  const [postId, setPostId] = useState("");
  const [userId, setUserId] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  // connect SignalR
  const handleConnect = async () => {
    if (!postId) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    await conn.start();
    console.log("✅ Connected");

    await conn.invoke("JoinPost", postId);

    conn.on("ReceiveComment", (comment) => {
      console.log("Realtime:", comment);
      setComments((prev) => [...prev, comment]);
    });

    setConnection(conn);
  };

  // gửi comment
  const handleSend = async () => {
    if (!content || !postId || !userId) return;

    await axios.post(API_URL, {
      content,
      postId : postId,
      authId: userId, 
    });

    setContent("");
  };

  // cleanup
  useEffect(() => {
    return () => {
      connection?.stop();
    };
  }, [connection]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Realtime Comment Test</h2>

      {/* input */}
      <div>
        <input
          placeholder="PostId"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
        />
      </div>

      <div>
        <input
          placeholder="UserId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <button onClick={handleConnect}>Connect</button>

      <hr />

      {/* comments */}
      <div>
        {comments.map((c, i) => (
          <div key={i}>
            <b>{c.author}</b>: {c.content}
          </div>
        ))}
      </div>

      <hr />

      {/* send */}
      <input
        placeholder="Write comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}