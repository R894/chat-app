import messageModel from "../models/messageModel";
import { Request, Response } from "express";
export const createMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, text } = req.body;
  try {
    const newMessage = new messageModel({ chatId, senderId, text });
    const response = await newMessage.save();

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
