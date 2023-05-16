import {SlashCommandBuilder} from "discord.js";
import {type Command} from "../interfaces/Command";
import {registerMember} from "../modules/registerMember";

export const register: Command = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register yourself with the database")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Your full name")
        .setRequired(true)),
  run: async (interaction) =>{
    await interaction.deferReply({ephemeral: true});
    const {user} = interaction;
    const nameOption = interaction.options.get("name");
    const register = await registerMember(user.id, nameOption?.value as string);
    if (register) {
      await interaction.editReply(`Successfully registered in database as: ${nameOption?.value as string}`);
    } else {
      await interaction.editReply("You are already registered in the database!");
    }
  },
};
