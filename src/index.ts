require("dotenv").config();
import { 
    Client, 
    GatewayIntentBits, 
    Events, 
    GuildScheduledEventPrivacyLevel, 
    GuildScheduledEventEntityType, 
    TextChannel
} from 'discord.js';
import { connectDatabase } from "./db/connectDatabase";
import { validateEnv } from "./utils/validateEnv";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
import * as chrono from "chrono-node";
import schedule from "node-schedule";
import Event, { EventInt } from './db/models/EventModel';
import { MemberInt } from './db/models/MemberModel';
import { channel } from 'diagnostics_channel';
import EventModel from './db/models/EventModel';
import { refreshScheduler } from './modules/refreshScheduler';



(async () => {
    if (!validateEnv()) return;
    // instantiate bot
    const BOT = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents] });
    
    // do this when the bot client is ready
    BOT.on(Events.ClientReady, async () => {
        await onReady(BOT);
        console.log(`Connected as ${ BOT.user!.tag }`);
    });

    // do this when an interaction is created
    BOT.on(Events.InteractionCreate,
        async (interaction) => await onInteraction(interaction)
    );
    
    // do this when a guild scheduled event is deleted/cancelled
    BOT.on(Events.GuildScheduledEventDelete,
        async (event) => {
            try {
                const result = await EventModel.deleteOne({ eventName: event.name, date: event.scheduledStartAt });
                // console.log(result);
                await refreshScheduler(BOT);
            } catch (err) {
                console.error("Error deleting event: ", err);
            }
        }
    );

    // do this when a guild scheduled event is created
    BOT.on(Events.GuildScheduledEventCreate, 
        async () => {
            console.log("Event created")
        });

    // connect to db
    await connectDatabase();
    // login to bot session with token
    await BOT.login(process.env.DISCORD_TOKEN);

})();