"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
if (!ACCESS_SECRET)
    throw new Error("Falta JWT_SECRET en .env");
if (!REFRESH_SECRET)
    throw new Error("Falta REFRESH_SECRET en .env");
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user._id,
        role: user.role,
        username: user.username,
    }, ACCESS_SECRET, { expiresIn: '2h' });
};
exports.generateAccessToken = generateAccessToken;
// Refreshtoken solo requiere el userId 
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
