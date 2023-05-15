import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export const leaderboard: Command = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Fine Leaderboard"),
    run: async (interaction) => {
        await interaction.deferReply();
        
    }
}