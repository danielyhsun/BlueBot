import { Client, REST, TextChannel } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { Routes } from "discord-api-types/v9";
import Event, { EventInt } from "../db/models/EventModel";
import schedule from "node-schedule";
import { refreshScheduler } from "../modules/refreshScheduler";

export const onReady = async (BOT: Client) => {
    const rest = new REST({ version: "10" }).setToken(
        process.env.DISCORD_TOKEN as string
    );
    const commandData = CommandList.map((command) => command.data.toJSON());
    await rest.put(
        Routes.applicationGuildCommands(
            BOT.user?.id || "missing id", 
            process.env.GUILD_ID as string
        ), 
        { body: commandData }
    );
    console.log("Discord ready!");

    await refreshScheduler(BOT);
}