import { MemberInt } from "../db/models/MemberModel"

export const updateMemberData = async (Member: MemberInt, fineChange: number) => {
    Member.fine = Member.fine + fineChange;
    await Member.save();
    return Member;
}