import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { getMemberData } from "../modules/getMemberData";
import { updateMemberData } from "../modules/updateMemberData";

export const stats: Command = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Show statistics"),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const targetMember = await getMemberData(user.id);
        if (targetMember !== null) {
        console.log(targetMember);
        const statsEmbed = new EmbedBuilder();

        statsEmbed
            .setTitle(`Stats for ${ targetMember.name }`)
            .addFields(
                { name: "Attendance", value: targetMember.attendance.toString() + "%" },
                { name: "Community Service", value: targetMember.cs },
                { name: "Current Fine", value: targetMember!.fine.toString() });

        await interaction.editReply({ embeds: [statsEmbed] });
        } else {
            await interaction.editReply("You are not registered!");
        }
    }
}