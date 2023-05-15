import { Document, model, Schema, Types } from "mongoose";

export interface EventInt extends Document {
    date: Date;
    attending: Types.ObjectId[];
}

export const Event = new Schema({
    date: Date,
    attending: [{ type: Types.ObjectId, ref: "member" }],
})

export default model<EventInt>("event", Event);