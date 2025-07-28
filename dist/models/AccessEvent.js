"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessEvent = void 0;
const mongoose_1 = require("mongoose");
const AccessEventSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    userName: { type: String },
    cardId: { type: String, required: true },
    doorId: { type: String, required: true },
    doorName: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String },
    result: { type: String } // <-- Y ESTA LÍNEA
});
exports.AccessEvent = (0, mongoose_1.model)("AccessEvent", AccessEventSchema, "access_events");
