import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface User {
            _id: string;
            userId?: string;
            role: string;
            username?: string;
            [key: string]: any;
        }
        interface Request {
            userId?: string;
            user?: User;
        }
    }
}

// Middleware: Verifica y decodifica el token JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT_SECRET no está definido en el entorno" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded as any; 
        req.userId = (decoded as any).userId || (decoded as any)._id; 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado, Se le recomienda volver a iniciar sesión' });
    }
};

// Middleware: Solo deja pasar a admins
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
        return res.status(403).json({ message: "Acceso no autorizado" });
    }
    next();
};

// Middleware: Deja pasar al propio usuario o a un admin
export const isSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || (req.user._id?.toString() !== req.params.id && req.user.role?.toLowerCase() !== 'admin')) {
        return res.status(403).json({ message: "Acceso no autorizado" });
    }
    next();
};
