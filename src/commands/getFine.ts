import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { type Command } from "../interfaces/Command";
import { getMemberData } from "../modules/getMemberData";
import { type MemberInt } from "../db/models/MemberModel";

export const getFine: Command = {
  data: new SlashCommandBuilder()
    .setName("getfine")
    .setDescription("Check your fine")
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to check fine of").setRequired(false)
    ),
  run: async (interaction) => {
    await interaction.deferReply();
    const memberOption = interaction.options.get("member");
    let targetMember: MemberInt | null;
    if (memberOption) {
      const member = memberOption;
      targetMember = await getMemberData(member.value as string);
    } else {
      const { user } = interaction;
      targetMember = await getMemberData(user.id);
    }

    if (targetMember !== null) {
      const fineEmbed = new EmbedBuilder();

      let finesAndReasons = "";
      targetMember.fines.forEach((fine, index) => {
        finesAndReasons += `${index + 1}: ${fine.amount} - ${fine.reason}\n`;
      });

      fineEmbed
        .setTitle("Fines")
        .setDescription(`for ${interaction.user}`)
        .addFields({ name: "Fines", value: finesAndReasons });
      await interaction.editReply({ embeds: [fineEmbed] });
    } else {
      await interaction.editReply("User is not a registered member!");
    }
  },
};
