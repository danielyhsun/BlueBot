import { Message, SlashCommandBuilder, CommandInteraction, TextChannel, Client } from 'discord.js';
import schedule from "node-schedule";
import Event from '../db/models/EventModel';

export const refreshScheduler = async (BOT: Client) => {
    // clear all scheduled jobs
    schedule.cancelJob("*");

    // fetch events from db
    const events = await Event.find({}).exec();

    // schedule new jobs for each event
    events.forEach(event => {
        console.log(event.date);
        schedule.scheduleJob(event.date, async() => {
            try {
                console.log(event.date);
                const channel = BOT.channels.cache.get(process.env.EVENT_CHANNEL_ID as string) as TextChannel;
                if (!channel) {
                    console.error("Events channel not found");
                    return;
                }
    
                await channel.send(`Event: ${event.eventName} is starting soon`);
                console.log("reminder sent");
            } catch (err) {
                console.error(err);
            }
        })
    })
    console.log("schedule refreshed!");
};