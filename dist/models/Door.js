"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Door = void 0;
const mongoose_1 = require("mongoose");
const DoorSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true
    },
    edificio: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    activa: {
        type: Boolean,
        default: true
    },
    state: {
        type: String,
        enum: ["open", "close"],
        required: true,
        default: "close"
    }
});
exports.Door = (0, mongoose_1.model)('Door', DoorSchema);
