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

  // when a guild scheduled event is created add it to the db
  client.on(Events.GuildScheduledEventCreate, async (event) => {
    try {
      // add event to db
      await EventModel.create({
        eventName: event.name,
        date: event.scheduledStartAt,
        required: false,
        attendance: [],
      });
      console.log("Event added to db");
      // refresh scheduler after event is added to db
      await refreshScheduler(client);
    } catch (err) {
    console.error("Error adding event: ", err);
    }
  });

  // do this when a user subscribes to a guild scheduled event
  client.on(Events.GuildScheduledEventUserAdd, async (event) => {
    try {
      // fetch subscribers for event
      const subscribers =  await event.fetchSubscribers();
      // get the discord user ids of the subscribers
      const userIds = subscribers.map(subscriber => subscriber.user.id);
      console.log(userIds);
      // set the events description to the discord usernames of the subscribers
      const userTags = subscribers.map(subscriber => subscriber.user);
      event.setDescription(userTags.join("\n"));
      // update list of userIds in event attendance in the db
      await EventModel.updateOne({
          eventName: event.name,
          date: event.scheduledStartAt,
        },
        {
          $set: {
            attendance: userIds,
          },
        });
    } catch (err) {
      console.error("Error adding user to event attendance: ", err);
    }
  });

  // Do this when a guild scheduled event is deleted/cancelled
  client.on(Events.GuildScheduledEventDelete, async (event) => {
    try {
      // delete event from db
      console.log(event.name);
      console.log(event.scheduledStartAt);
      await EventModel.deleteOne({ 
        eventName: event.name, 
        date: event.scheduledStartAt,
      });
      console.log("Event deleted");
      await refreshScheduler(client);
    } catch (err) {
      console.error("Error deleting event: ", err);
    }
  });

  // Do this when a guild scheduled event is created
  client.on(Events.GuildScheduledEventCreate, async () => {
    console.log("Event created");
  });

  client.on(Events.MessageReactionAdd, async () => {
    
  });

  // Connect to db
  await connectDatabase();
  // Login to bot session with token
  await client.login(process.env.DISCORD_TOKEN);
})();
