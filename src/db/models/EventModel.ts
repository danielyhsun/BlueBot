import { type Document, model, Schema } from "mongoose";

export type EventInt = {
  eventName: string;
  date: Date;
  required: boolean,
  attendance: string[];
} & Document;

export const Event = new Schema({
  eventName: String,
  date: Date,
  required: Boolean,
  attendance: [],
});

export default model<EventInt>("event", Event);
