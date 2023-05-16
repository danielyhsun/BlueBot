import { type Document, model, Schema } from "mongoose";

export type EventInt = {
  eventName: string;
  date: Date;
  // Attending: Types.ObjectId[];
} & Document;

export const Event = new Schema({
  eventName: String,
  date: Date,
  // Attending: [{ type: Types.ObjectId, ref: "member" }],
});

export default model<EventInt>("event", Event);
