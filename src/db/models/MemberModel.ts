import { type Document, model, Schema } from "mongoose";

export type MemberInt = {
  discordId: string;
  name: string;
  attendance: number;
  cs: string;
  fineTotal: number;
  fines: Array<{ amount: number; reason: string }>;
} & Document;

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
});

export default model<MemberInt>("member", Member);
