import { Server } from "socket.io";
import Chat from "./models/chat.model.js";

let io;

export const initSocket = (server) => {
    console.log("Test 1");
    
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(" New socket connected:", socket.id);
    socket.on("joinRoom", ({ projectId }) => {
        socket.join(`room_${projectId}`);
        console.log(`Socket ${socket.id} joined room_${projectId}`);
    });
    
    socket.on("sendMessage", async ({ projectId, senderId, message }) => {
      console.log("HK1");
        if (!projectId || !senderId || !message?.trim()) return;
              console.log("HK2");
        try{

      // Save message to DB
      let chat = await Chat.findOne({ projectId });

      const newMessage = { senderId, message };

      if (!chat) {
        chat = await Chat.create({
          projectId,
          messages: [newMessage],
        });
      } else {
        chat.messages.push(newMessage);
        await chat.save();
      }
        const savedMsg = chat.messages[chat.messages.length - 1];

      // Emit message to room
      io.to(`room_${projectId}`).emit("receiveMessage", savedMsg);
      }
      catch(err){
          console.log("error ",err);
          
      }
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
