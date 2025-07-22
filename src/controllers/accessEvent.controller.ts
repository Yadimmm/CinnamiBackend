import { Request, Response } from "express";
import { AccessEvent } from "../models/AccessEvent";
import { User } from "../models/User";
import { Card } from "../models/Card";
import { Door } from "../models/Door";

// --- INTERFAZ AUXILIAR SOLO PARA TIPADO .lean() ---
interface DoorLean {
  _id: any;
  doorId?: string;
  name?: string;
  nombre?: string;
}

// Devuelve los últimos 3 accesos recientes con información enriquecida
export const getRecentAccessEvents = async (req: Request, res: Response) => {
  try {
    const events = await AccessEvent.find().sort({ timestamp: -1 }).limit(3);

    const enriched = await Promise.all(events.map(async event => {
      const user = event.userId ? await User.findById(event.userId).lean() : null;

      let cardUid = "";
      if (user && user.cardId) {
        const card = await Card.findOne({ uid: user.cardId }).lean();
        cardUid = card ? card.uid : user.cardId;
      }

      // --- Usando DoorLean para evitar errores de TS ---
      let doorName = "";
      if (event.doorId) {
        const door = await Door.findOne({ doorId: event.doorId }).lean<DoorLean>();
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener accesos recientes", error });
  }
};

// Devuelve TODOS los accesos con información enriquecida
export const getAllAccessEvents = async (req: Request, res: Response) => {
  try {
    const events = await AccessEvent.find().sort({ timestamp: -1 });

    const enriched = await Promise.all(events.map(async event => {
      const user = event.userId ? await User.findById(event.userId).lean() : null;

      let cardUid = "";
      if (user && user.cardId) {
        const card = await Card.findOne({ uid: user.cardId }).lean();
        cardUid = card ? card.uid : user.cardId;
      }

      let doorName = "";
      if (event.doorId) {
        const door = await Door.findOne({ doorId: event.doorId }).lean<DoorLean>();
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener accesos", error });
  }
};

// Devuelve TODOS los eventos de acceso de SOLO el usuario autenticado (enriquecidos)
export const getUserAccessEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.user?._id || req.userId || req.body.userId;
    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const events = await AccessEvent.find({ userId }).sort({ timestamp: -1 });

    const enriched = await Promise.all(events.map(async event => {
      const user = event.userId ? await User.findById(event.userId).lean() : null;

      let cardUid = "";
      if (user && user.cardId) {
        const card = await Card.findOne({ uid: user.cardId }).lean();
        cardUid = card ? card.uid : user.cardId;
      }

      let doorName = "";
      if (event.doorId) {
        const door = await Door.findOne({ doorId: event.doorId }).lean<DoorLean>();
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener accesos del usuario", error: err });
  }
};
