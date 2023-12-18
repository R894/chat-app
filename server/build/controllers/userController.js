"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.findUser = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET;
    if (!jwtKey) {
        throw new Error("Missing JWT_SECRET env param");
    }
    return jsonwebtoken_1.default.sign({ _id }, jwtKey, { expiresIn: "15m" });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        let user = yield userModel_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).json("User already exists");
        }
        if (!name || !email || !password) {
            return res.status(400).json("All fields are required");
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json("Invalid email");
        }
        if (!validator_1.default.isStrongPassword(password)) {
            return res.status(400).json("Password must be a strong password");
        }
        user = new userModel_1.default({ name, email, password });
        const salt = yield bcrypt_1.default.genSalt(12);
        user.password = yield bcrypt_1.default.hash(user.password, salt);
        yield user.save();
        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name, email, token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!password) {
            res.status(400).json("Password cannot be empty");
            return;
        }
        let user = yield userModel_1.default.findOne({ email: email });
        if (!user) {
            res.status(404).json("Incorrect email or password");
            return;
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).json("Incorrect email or password");
            return;
        }
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email, token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.loginUser = loginUser;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield userModel_1.default.findById(userId);
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.findUser = findUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const users = yield userModel_1.default.find();
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
exports.getUsers = getUsers;
