import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { type Command } from "../interfaces/Command";
import { getMemberData } from "../modules/getMemberData";
import { calculateAttendance } from "../modules/calculateAttendance";
import { MemberInt } from '../db/models/MemberModel';

export const stats: Command = {
  data: new SlashCommandBuilder().setName("stats").setDescription("Show statistics"),
  run: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const targetMember = await getMemberData(user.id) as MemberInt;
    await calculateAttendance(targetMember);
    if (targetMember !== null) {
      console.log(targetMember);
      const statsEmbed = new EmbedBuilder();

      statsEmbed
        .setTitle("Statistics")
        .setDescription(`for ${interaction.user}`)
        .addFields(
          { name: "Attendance", value: targetMember.attendance.toString() + "%" },
          { name: "Community Service", value: targetMember.cs },
          { name: "Current Fine", value: targetMember.fineTotal.toString() }
        );

      await interaction.editReply({ embeds: [statsEmbed] });
    } else {
      await interaction.editReply("You are not registered!");
    }
  },
};
