require("dotenv").config();
import { Client, GatewayIntentBits, Events, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } from 'discord.js';
import { connectDatabase } from "./db/connectDatabase";
import { validateEnv } from "./utils/validateEnv";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
import * as chrono from "chrono-node";


(async () => {
    if (!validateEnv()) return;
    // instantiate bot
    const BOT = new Client({ intents: [GatewayIntentBits.Guilds] });
    
    BOT.on(Events.ClientReady, async () => {
        await onReady(BOT);
        console.log(`Connected as ${ BOT.user!.tag }`)
    });

    BOT.on(Events.InteractionCreate,
        async (interaction) => await onInteraction(interaction)
    );

    // connect to db
    await connectDatabase();
    // login to bot session with token
    await BOT.login(process.env.DISCORD_TOKEN);

})();