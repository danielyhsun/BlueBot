import { type MemberInt } from "../db/models/MemberModel";

export const updateMemberDataAddFine = async (
  Member: MemberInt,
  fineChange: number,
  fineReason: string
) => {
  Member.fines.push({ amount: fineChange, reason: fineReason });
  Member.fineTotal += fineChange;
  await Member.save();
  return Member;
};
