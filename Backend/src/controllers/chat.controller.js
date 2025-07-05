// Add to your routes (e.g., chat.routes.js)
import express from "express";
import Chat from "../models/chat.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";
import {ApiError} from "../utils/apierror.js"


export const chatdata=asynchandler(async(req,res)=>{
    const {pjtid}=req.body;
    const chat = await Chat.findOne({ projectId: pjtid });
    res.json(chat?.messages || []);
});

