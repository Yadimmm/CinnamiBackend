"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// PERMITE SOLO LOCALHOST:3001 (React) Y 127.0.0.1:3001
const allowedOrigins = [
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://172.20.30.248:3001',
    'https://cinnami.utdprojects.cloud'
];
// Helmet primero para proteger los headers HTTP
app.use((0, helmet_1.default)());
// CORS configurado
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Permite herramientas como Postman/curl sin origin
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        else {
            return callback(new Error('No permitido por CORS: ' + origin), false);
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/api/auth', auth_routes_1.default);
app.get('/', (req, res) => {
    res.send('¡API de Cinnami funcionando! Para usar la API, visita /api/auth/*');
});
// Conexion a la base de datos y arranque del servidor
(0, db_1.default)().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`El servidor funciona en el puerto: ${PORT}`);
        console.log(`Puedes acceder desde:`);
        console.log(`- http://localhost:${PORT}/`);
    });
}).catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
});
