import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://devlinkbackend.onrender.com", {
  withCredentials: true,
});

const projectId = "6837088589b3d5646e0db65e";
const clientId = "6837072fafa2f289ba575c34";
const developerId = "68445268431b42897198b51b";

// Change this to test as client or developer
const currentUserId = clientId; // or developerId

export default function TestChat() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Join the room
    socket.emit("joinRoom", { projectId });

    // Listen for new messages
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      projectId,
      senderId: currentUserId,
      message,
    });

    setChat((prev) => [
      ...prev,
      { senderId: currentUserId, message, timestamp: new Date() },
    ]);

    setMessage("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>🗨️ Project Chat Test</h2>

      <div style={{ border: "1px solid #ccc", padding: "1rem", height: "300px", overflowY: "scroll" }}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.senderId === currentUserId ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                background: msg.senderId === currentUserId ? "#cce5ff" : "#e2e3e5",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem", display: "flex" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
}