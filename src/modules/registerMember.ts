import MemberModel from "../db/models/MemberModel"

export const registerMember = async (id: string, name: string, ) => {
    if (await MemberModel.exists({ discordId: id })) {
        // return false is member is already registered
        return false;
    } else {
        // creates data for new member
        const memberData = 
        (await MemberModel.create({
            discordId: id,
            name: name,
            attendance: 100,
            cs: "0/2",
            fine: 0,
        }))
    // return true after registration
    return true;
    }
}