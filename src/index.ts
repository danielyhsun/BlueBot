import dotenv from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { connectDatabase } from "./db/connectDatabase";
import { validateEnv } from "./utils/validateEnv";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
import EventModel from "./db/models/EventModel";
import { refreshScheduler } from "./modules/refreshScheduler";

dotenv.config();

(async () => {
  if (!validateEnv()) {
    return;
  }

  // Instantiate bot
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildPresences,
    ],
  });

  // Do this when the bot client is ready
  client.on(Events.ClientReady, async () => {
    await onReady(client);
    console.log(`Connected as ${client.user?.tag}`);
  });

  // Do this when an interaction is created
  client.on(Events.InteractionCreate, async (interaction) => onInteraction(interaction));

  // Do this when a guild scheduled event is deleted/cancelled
  client.on(Events.GuildScheduledEventDelete, async (event) => {
    try {
      await EventModel.deleteOne({
        eventName: event.name,
        date: event.scheduledStartAt,
      });
      // Console.log(result);
      await refreshScheduler(client);
    } catch (err) {
      console.error("Error deleting event: ", err);
    }
  });

  // Do this when a guild scheduled event is created
  client.on(Events.GuildScheduledEventCreate, async () => {
    console.log("Event created");
  });

  // Connect to db
  await connectDatabase();
  // Login to bot session with token
  await client.login(process.env.DISCORD_TOKEN);
})();
