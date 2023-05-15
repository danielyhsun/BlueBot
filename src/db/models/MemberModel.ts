import { Document, model, Schema } from "mongoose";

export interface MemberInt extends Document {
    discordId: string;
    name: string;
    attendance: number;
    cs: string;
    fine: number;
}

export const Member = new Schema({
    discordId: String,
    name: String,
    attendance: Number,
    cs: String,
    fine: Number,
})

export default model<MemberInt>("member", Member);