import { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { type Command } from "../interfaces/Command";
import { getMemberData } from "../modules/getMemberData";
import { updateMemberData } from "../modules/updateMemberData";

export const addFine: Command = {
  data: new SlashCommandBuilder()
    .setName("addfine")
    .setDescription("Add a fine to a member")
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to add fine to").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("amount").setDescription("Amount to add").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for fine").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async (interaction) => {
    await interaction.deferReply();
    // const { user } = interaction;
    const memberOption = interaction.options.get("member");
    const targetMember = await getMemberData(memberOption?.value as string);
    if (targetMember !== null) {
      const amtOption = interaction.options.get("amount");
      const amt = amtOption?.value as number;
      const reasonOption = interaction.options.get("reason");
      const reason = reasonOption?.value as string;
      // const updatedMember = await updateMemberData(targetMember, amt, reason);
      const fineEmbed = new EmbedBuilder();
      fineEmbed.setTitle("Fine Updated").addFields(
        // { name: "Amount to Add", value: amt.toString },
        { name: "Member", value: `${memberOption?.user}` },
        { name: "Reason", value: reason },
        { name: "Amount Added", value: amt.toString(), inline: true },
        { name: "Updated Fine", value: targetMember.fineTotal.toString(), inline: true }
      );
      await interaction.editReply({ embeds: [fineEmbed] });
    } else {
      await interaction.editReply("User is not a registered member yet!");
    }
  },
};
