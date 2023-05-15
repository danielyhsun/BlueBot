require("dotenv").config();
import { Client, GatewayIntentBits } from "discord.js";
import { connectDatabase } from "./db/connectDatabase";
import { validateEnv } from "./utils/validateEnv";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";


(async () => {
    if (!validateEnv()) return;
    // instantiate bot
    const BOT = new Client({ intents: [GatewayIntentBits.Guilds] });
    
    BOT.on("ready", async () => {
        await onReady(BOT);
        console.log(`Connected as ${ BOT.user!.tag }`)
    }
        )
    BOT.on(
        "interactionCreate",
        async (interaction) => await onInteraction(interaction)
    );

    // connect to db
    await connectDatabase();
    // login to bot session with token
    await BOT.login(process.env.DISCORD_TOKEN);

})();