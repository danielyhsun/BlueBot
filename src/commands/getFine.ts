import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { updateMemberData } from "../modules/updateMemberData";
import { getMemberData } from "../modules/getMemberData";

export const getFine: Command = {
    data: new SlashCommandBuilder()
        .setName("getfine")
        .setDescription("Check your fine"),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const targetMember = await getMemberData(user.id);

        const fineEmbed = new EmbedBuilder();
        fineEmbed
            .setTitle(`Fine for @${ user.tag }`)
            .addFields(
                { name: "Current Fine", value: targetMember.fine.toString() });
        await interaction.editReply({ embeds: [fineEmbed] });
    },
}