require('dotenv').config();
const { token } = process.env.DISCORD_TOKEN;
const { Client, Events, GatewayIntentBits } = require('discord.js');

// create new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
})

client.login(token);

