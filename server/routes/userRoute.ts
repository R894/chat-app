import express from "express";
import {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);

export default router;
