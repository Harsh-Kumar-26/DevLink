import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { createServer } from "http";
import { initSocket } from "./socket.js"; 

dotenv.config();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO on the server
initSocket(server); 

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(` Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });
