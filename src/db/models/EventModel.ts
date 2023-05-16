import { Document, model, Schema, Types } from "mongoose";

export interface EventInt extends Document {
    eventName: string;
    date: Date;
    // attending: Types.ObjectId[];
}

export const Event = new Schema({
    eventName: String,
    date: Date,
    // attending: [{ type: Types.ObjectId, ref: "member" }],
})

export default model<EventInt>("event", Event);