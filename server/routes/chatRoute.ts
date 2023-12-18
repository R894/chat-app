import express from "express";
import {
  findChat,
  createChat,
  findUserChats,
} from "../controllers/chatController";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

export default router;
