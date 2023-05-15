import { Document, model, Schema } from "mongoose";

export interface MemberInt extends Document {
    discordId: string;
    fine: number;
}

export const Member = new Schema({
    discordId: String,
    fine: Number,
})

export default model<MemberInt>("member", Member);