// Add to your routes (e.g., chat.routes.js)
import express from "express";
import Chat from "../models/chat.model.js";

const router = express.Router();

router.get("/chat/:projectId", async (req, res) => {
  try {
    const chat = await Chat.findOne({ projectId: req.params.projectId });
    res.json(chat?.messages || []);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
