"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
    },
    password: { type: String, required: true, minlength: 6 },
}, {
    timestamps: true,
});
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
