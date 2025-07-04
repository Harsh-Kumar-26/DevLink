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
    console.log(" New socket connected:", socket);
try{
    socket.on("joinRoom", ({ projectId }) => {
      socket.join(`room_${projectId}`);
      console.log(`Socket ${socket.id} joined room_${projectId}`);
    });

    socket.on("sendMessage", async ({ projectId, senderId, message }) => {
      if (!projectId || !senderId || !message?.trim()) return;

      // Save message to DB
      let chat = await Chat.findOne({ projectId });

      const newMessage = { sender: senderId, message };

      if (!chat) {
        chat = await Chat.create({
          projectId,
          messages: [newMessage],
        });
      } else {
        chat.messages.push(newMessage);
        await chat.save();
      }

      // Emit message to room
      io.to(`room_${projectId}`).emit("receiveMessage", {
        senderId,
        message,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
}
catch(err){
    console.log(err);
    
}
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
