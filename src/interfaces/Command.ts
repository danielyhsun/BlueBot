import {
  type SlashCommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
  type CommandInteraction,
} from "discord.js";

export type Command = {
  data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
  run: (interaction: CommandInteraction) => Promise<void>;
};
