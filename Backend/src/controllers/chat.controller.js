// Add to your routes (e.g., chat.routes.js)
import express from "express";
import Chat from "../models/chat.model.js";

export const chatdata=asynchandler(async(req,res)=>{
    const {pjtid}=req.body;
    const chat = await Chat.findOne({ projectId: pjtid });
    res.json(chat?.messages || []);
});

