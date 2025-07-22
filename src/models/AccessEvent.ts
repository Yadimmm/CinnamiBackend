import { Schema, model, Document } from "mongoose";

export interface IAccessEvent extends Document {
  userId: string;
  userName?: string;
  cardId: string;
  doorId: string;
  doorName?: string;
  timestamp: Date;
  status?: string;
  result?: string; // <-- AGREGA ESTA LÍNEA
}

const AccessEventSchema = new Schema<IAccessEvent>({
  userId:   { type: String, required: true },
  userName: { type: String },
  cardId:   { type: String, required: true },
  doorId:   { type: String, required: true },
  doorName: { type: String },
  timestamp:{ type: Date,   default: Date.now },
  status:   { type: String },
  result:   { type: String } // <-- Y ESTA LÍNEA
});

export const AccessEvent = model<IAccessEvent>("AccessEvent", AccessEventSchema, "access_events");
