import MemberModel from "../db/models/MemberModel";
import { calculateAttendance } from "./calculateAttendance";

export const registerMember = async (id: string, name: string) => {
  if (await MemberModel.exists({ discordId: id })) {
    // Return false is member is already registered
    return false;
  }

  // Creates data for new member
  await MemberModel.create({
    discordId: id,
    name: name,
    attendance: 0,
    cs: "0/2",
    fineTotal: 0,
    fines: [],
  });
  // Return true after registration
  return true;
};
