import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { updateMemberData } from "../modules/updateMemberData";
import { getMemberData } from "../modules/getMemberData";
//Add Event to Calendar and Google Sheet so then bros can get marked down for attendance
export const addEvent: Command = {
    data: new SlashCommandBuilder()
        .setName("addEvent")
        .setDescription("Adds Event to Calendar"),
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