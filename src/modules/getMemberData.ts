import MemberModel from "../db/models/MemberModel"

export const getMemberData = async (id: string) => {
    const memberData = 
        (await MemberModel.findOne({ discordId: id })) ||
        (await MemberModel.create({
            discordId: id,
            fine: 0,
        }))
    return memberData;
}