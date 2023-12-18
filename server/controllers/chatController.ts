import chatModel from "../models/chatModel";
import { Request, Response } from "express";

export const createChat = async (req: Request, res: Response) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    });
    const response = await newChat.save();

    res.status(200).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const findUserChats = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const findChat = async (req: Request, res: Response) => {
    const {firstId, secondId} = req.params;
    try {
      const chat = await chatModel.findOne({
        members: { $all: [firstId, secondId] },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };
