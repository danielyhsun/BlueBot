import { Document, model, Schema } from "mongoose";

export interface MemberInt extends Document {
    discordId: string;
    name: string;
    attendance: number;
    cs: string;
    fineTotal: number;
    fines: { amount: number; reason: string }[];
}

export const Member = new Schema({
    discordId: String,
    name: String,
    attendance: Number,
    cs: String,
    fineTotal: Number,
    fines: {
        type: [
            {
                amount: Number,
                reason: String,
            },
        ],
        default: [], // Default empty array
    },
})

export default model<MemberInt>("member", Member);