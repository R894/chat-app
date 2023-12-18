"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
// Fetch environment variables
dotenv_1.default.config();
const uri = process.env.CONN_STRING || "";
const port = process.env.PORT || 5000;
// Connect to DB
mongoose_1.default
    .connect(uri)
    .then(() => console.log(`Connected to DB`))
    .catch((err) => console.error(`Db connection failed: ${err}`));
// Setup express
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/users", userRoute_1.default);
app.use("/api/chat", chatRoute_1.default);
app.use("/api/messages", messageRoute_1.default);
app.get("/", (req, res) => {
    res.send("Hi");
});
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
