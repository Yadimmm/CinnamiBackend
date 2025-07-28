"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestDoorState = void 0;
const Door_1 = require("../models/Door");
// Obtener el estado más reciente de la puerta
const getLatestDoorState = async (req, res) => {
    try {
        const latest = await Door_1.Door.findOne().sort({ timestamp: -1 });
        res.json({
            state: latest?.state ?? "desconocido",
            name: latest?.name ?? "Sin puerta"
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el estado de la puerta", error });
    }
};
exports.getLatestDoorState = getLatestDoorState;
