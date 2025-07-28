"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSelfOrAdmin = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware: Verifica y decodifica el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Acceso no autorizado' });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT_SECRET no está definido en el entorno" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        req.userId = decoded.userId || decoded._id;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado, Se le recomienda volver a iniciar sesión' });
    }
};
exports.verifyToken = verifyToken;
// Middleware: Solo deja pasar a admins
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
        return res.status(403).json({ message: "Acceso no autorizado" });
    }
    next();
};
exports.isAdmin = isAdmin;
// Middleware: Deja pasar al propio usuario o a un admin
const isSelfOrAdmin = (req, res, next) => {
    if (!req.user || (req.user._id?.toString() !== req.params.id && req.user.role?.toLowerCase() !== 'admin')) {
        return res.status(403).json({ message: "Acceso no autorizado" });
    }
    next();
};
exports.isSelfOrAdmin = isSelfOrAdmin;
