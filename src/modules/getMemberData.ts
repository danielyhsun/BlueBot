import MemberModel from "../db/models/MemberModel";

/**
 * Retrieves the model associated with the given discord id string
 *
 * @param id the given discord id
 * @returns the model associated with the given discord id
 */
export const getMemberData = async (id: string) => {
  if (!(await MemberModel.exists({ discordId: id }))) {
    return null;
  }

  const memberData = await MemberModel.findOne({ discordId: id });
  return memberData;
};
