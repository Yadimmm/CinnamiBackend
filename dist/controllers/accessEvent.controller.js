"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAccessEvents = exports.getAllAccessEvents = exports.getRecentAccessEvents = void 0;
const AccessEvent_1 = require("../models/AccessEvent");
const User_1 = require("../models/User");
const Card_1 = require("../models/Card");
const Door_1 = require("../models/Door");
// Devuelve los últimos 3 accesos recientes con información enriquecida
const getRecentAccessEvents = async (req, res) => {
    try {
        const events = await AccessEvent_1.AccessEvent.find().sort({ timestamp: -1 }).limit(3);
        const enriched = await Promise.all(events.map(async (event) => {
            const user = event.userId ? await User_1.User.findById(event.userId).lean() : null;
            let cardUid = "";
            if (user && user.cardId) {
                const card = await Card_1.Card.findOne({ uid: user.cardId }).lean();
                cardUid = card ? card.uid : user.cardId;
            }
            // --- Usando DoorLean para evitar errores de TS ---
            let doorName = "";
            if (event.doorId) {
                const door = await Door_1.Door.findOne({ doorId: event.doorId }).lean();
                doorName = door ? (door.name || door.nombre || event.doorId) : event.doorId;
            }
            return {
                _id: event._id,
                userId: event.userId,
                userName: user ? `${user.firstName} ${user.lastName}` : "Sin nombre",
                firstName: user ? user.firstName : "",
                lastName: user ? user.lastName : "",
                username: user ? user.username : "",
                email: user ? user.email : "",
                role: user ? user.role : "",
                cardUid: cardUid || event.cardId || "",
                doorName,
                timestamp: event.timestamp,
                status: event.status || event.result || "",
            };
        }));
        res.json({ events: enriched });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener accesos recientes", error });
    }
};
exports.getRecentAccessEvents = getRecentAccessEvents;
// Devuelve TODOS los accesos con información enriquecida
const getAllAccessEvents = async (req, res) => {
    try {
        const events = await AccessEvent_1.AccessEvent.find().sort({ timestamp: -1 });
        const enriched = await Promise.all(events.map(async (event) => {
            const user = event.userId ? await User_1.User.findById(event.userId).lean() : null;
            let cardUid = "";
            if (user && user.cardId) {
                const card = await Card_1.Card.findOne({ uid: user.cardId }).lean();
                cardUid = card ? card.uid : user.cardId;
            }
            let doorName = "";
            if (event.doorId) {
                const door = await Door_1.Door.findOne({ doorId: event.doorId }).lean();
                doorName = door ? (door.name || door.nombre || event.doorId) : event.doorId;
            }
            return {
                _id: event._id,
                userId: event.userId,
                userName: user ? `${user.firstName} ${user.lastName}` : "Sin nombre",
                firstName: user ? user.firstName : "",
                lastName: user ? user.lastName : "",
                username: user ? user.username : "",
                email: user ? user.email : "",
                role: user ? user.role : "",
                cardUid: cardUid || event.cardId || "",
                doorName,
                timestamp: event.timestamp,
                status: event.status || event.result || "",
            };
        }));
        res.json({ events: enriched });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener accesos", error });
    }
};
exports.getAllAccessEvents = getAllAccessEvents;
// Devuelve TODOS los eventos de acceso de SOLO el usuario autenticado (enriquecidos)
const getUserAccessEvents = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId || req.body.userId;
        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }
        const events = await AccessEvent_1.AccessEvent.find({ userId }).sort({ timestamp: -1 });
        const enriched = await Promise.all(events.map(async (event) => {
            const user = event.userId ? await User_1.User.findById(event.userId).lean() : null;
            let cardUid = "";
            if (user && user.cardId) {
                const card = await Card_1.Card.findOne({ uid: user.cardId }).lean();
                cardUid = card ? card.uid : user.cardId;
            }
            let doorName = "";
            if (event.doorId) {
                const door = await Door_1.Door.findOne({ doorId: event.doorId }).lean();
                doorName = door ? (door.name || door.nombre || event.doorId) : event.doorId;
            }
            return {
                _id: event._id,
                userId: event.userId,
                userName: user ? `${user.firstName} ${user.lastName}` : "Sin nombre",
                firstName: user ? user.firstName : "",
                lastName: user ? user.lastName : "",
                username: user ? user.username : "",
                email: user ? user.email : "",
                role: user ? user.role : "",
                cardUid: cardUid || event.cardId || "",
                doorName,
                timestamp: event.timestamp,
                status: event.status || event.result || "",
            };
        }));
        res.json({ events: enriched });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener accesos del usuario", error: err });
    }
};
exports.getUserAccessEvents = getUserAccessEvents;
