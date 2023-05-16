import MemberModel from "../db/models/MemberModel";

export const registerMember = async (id: string, name: string) => {
  if (await MemberModel.exists({ discordId: id })) {
    // Return false is member is already registered
    return false;
  }

  // Creates data for new member
  await MemberModel.create({
    discordId: id,
    name,
    attendance: 100,
    cs: "0/2",
    fineTotal: 0,
    fines: [],
  });
  // Return true after registration
  return true;
};
