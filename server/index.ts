import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import chatRoute from "./routes/chatRoute";
import messageRoute from "./routes/messageRoute";

// Fetch environment variables
dotenv.config();
const uri = process.env.CONN_STRING || "";
const port = process.env.PORT || 5000;

// Connect to DB
mongoose
  .connect(uri)
  .then(() => console.log(`Connected to DB`))
  .catch((err) => console.error(`Db connection failed: ${err}`));

// Setup express
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
