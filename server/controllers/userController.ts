import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";

const createToken = (_id: Types.ObjectId) => {
  const jwtKey = process.env.JWT_SECRET;

  if (!jwtKey) {
    throw new Error("Missing JWT_SECRET env param");
  }

  return jwt.sign({ _id }, jwtKey, { expiresIn: "15m" });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(400).json("User already exists");
    }
    if (!name || !email || !password) {
      return res.status(400).json("All fields are required");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid email");
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password must be a strong password");
    }

    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      res.status(400).json("Password cannot be empty");
      return;
    }

    let user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).json("Incorrect email or password");
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).json("Incorrect email or password");
      return;
    }
    const token = createToken(user._id);
    res.status(200).json({ name: user.name, email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const findUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const getUsers = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };
