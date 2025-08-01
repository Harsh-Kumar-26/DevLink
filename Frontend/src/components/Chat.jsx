import { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { use } from "react";
import axios from "axios";
// import { useMemo } from "react";



export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [currentUserId,setcurrentUserId]=useState(null);
  const [searchParams] = useSearchParams();
  const chatRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get("projectId");

    const socket=useMemo(()=>
      io("https://devlinkbackend.onrender.com",{
        withCredentials:true,
      }),[]
    );


    useEffect(()=>{
        async function fetchuser(){
        try {
            const response=await axios.get(
            `${import.meta.env.VITE_BACKENDURL}/current-user`,{ withCredentials: true });
            // console.log(response);
            setcurrentUserId(response.data.data._id);
            // console.log(response._id);
            
        } catch (error) {
            console.log(error);

        }
        }
        fetchuser();
    },[]);

    useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKENDURL}/chat`,{pjtid:projectId}, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (error) {
        console.log("Chat fetch error:", error);
      }
    };
    if (projectId) fetchMessages();
  }, [projectId]);


  useEffect(() => {
        console.log("Hi 1");

    if (!projectId) return;
    // socketRef.current = io(import.meta.env.VITE_BACKENDURL, {
    //   withCredentials: true,
    //   transports: ["websocket"],
    // });
    console.log("Hi 2",projectId);
      const handleReceive = (savedMsg) => {
    console.log("📥 R1");
    setMessages((prev) => [...prev, savedMsg]);
    console.log("📥 R2");
  };
    // const socket = socketRef.current;
    socket.on("connect",()=>{
      console.log("Connected");
    });
    socket.emit("joinRoom", { projectId });

     socket.off("receiveMessage", handleReceive);
  socket.on("receiveMessage", handleReceive);
    // console.log("m1",messages);
    

    return () => {
          socket.off("receiveMessage", handleReceive);
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    console.log("Received message from client:", { projectId, currentUserId, msg });
    if (!msg.trim() || !projectId || !currentUserId) return;
    console.log("Set 1");
    
    socket.emit("sendMessage", {
      projectId,
      senderId: currentUserId,
      message: msg,
    });
        console.log("Set 2");
    // setMessages((prev) => [
    //   ...prev,
    //   { senderId: currentUserId, message: msg, timestamp: new Date() },
    // ]);

    setMsg("");
  };

console.log("Set 3",messages);


    if (!currentUserId || !projectId) return null;

return (
  <div className="flex flex-col h-screen bg-[#0f1b2a] text-white">
    {/* Header */}
    <div className="flex items-center p-4 bg-[#1c2a3a] border-b border-gray-700">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 mr-3"
      >
        ← Back
      </button>
      <h2 className="text-xl font-semibold">Project Chat</h2>
    </div>

    {/* Chat Box */}
    <div
      ref={chatRef}
      className="flex-1 overflow-y-auto p-4 space-y-2"
      style={{ scrollBehavior: "smooth" }}
    >
      {(() => {
        const groupedMessages = {};

        messages.forEach((msg) => {
          const date = new Date(msg.timestamp || Date.now()).toDateString();
          if (!groupedMessages[date]) groupedMessages[date] = [];
          groupedMessages[date].push(msg);
        });

        const formatDate = (dateStr) => {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();

          if (dateStr === today) return "Today";
          if (dateStr === yesterday) return "Yesterday";
          return new Date(dateStr).toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        };

        return Object.entries(groupedMessages).map(([dateStr, msgs], index) => (
          <div key={index} className="space-y-2">
            <div className="text-center text-sm text-gray-400 my-4">
              ── {formatDate(dateStr)} ──
            </div>
            {msgs.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId;
              const time = new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-sm px-4 py-2 rounded-2xl shadow-md ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-700 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{time}</span>
                </div>
              );
            })}
          </div>
        ));
      })()}
    </div>

    {/* Input */}
    <div className="p-4 border-t border-gray-700 bg-[#1c2a3a] flex items-center gap-2">
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 rounded bg-[#263447] text-white outline-none"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
      >
        Send
      </button>
    </div>
  </div>
);
}
