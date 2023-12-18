import express from "express";
import { getMessages, createMessage } from "../controllers/messageController";

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export default router;
