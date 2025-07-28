"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestPersonCount = void 0;
const PersonCount_1 = require("../models/PersonCount");
// Obtener el último conteo de personas ingresadas
const getLatestPersonCount = async (req, res) => {
    try {
        const doc = await PersonCount_1.PersonCount.findOne().sort({ timestamp: -1 });
        res.json({ count: doc ? doc.counterValue : 0 });
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el conteo", error });
    }
};
exports.getLatestPersonCount = getLatestPersonCount;
