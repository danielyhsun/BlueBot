import { Message, SlashCommandBuilder, CommandInteraction, TextChannel, Client } from 'discord.js';
import schedule from "node-schedule";
import Event from '../db/models/EventModel';
import { eventReminderEmbed } from '../embeds/eventReminderEmbed';

export const refreshScheduler = async (BOT: Client) => {
    // clear all scheduled jobs
    schedule.cancelJob("*");

    // fetch events from db
    const events = await Event.find({}).exec();

    // schedule new jobs for each event
    events.forEach(event => {
        console.log(`Event date: ${event.date}`);
        const eventDateTimestamp = event.date.getTime();
        console.log(`Event date timestamp: ${eventDateTimestamp}`);
    
        // subtract 24 hours (in ms) from the event date
        const reminderDate = new Date(event.date);
        reminderDate.setHours(reminderDate.getHours() - 24);
        console.log(`Reminder date: ${reminderDate}`);
        const reminderDateTimestamp = reminderDate.getTime();
        console.log(`Reminder date timestamp: ${reminderDateTimestamp}`);
    
        schedule.scheduleJob(reminderDate, async() => {
            try {
                console.log(reminderDate);
                const channel = BOT.channels.cache.get(process.env.EVENT_CHANNEL_ID as string) as TextChannel;
                if (!channel) {
                    console.error("Events channel not found");
                    return;
                }
    
                // create new event reminder embed with this event's data
                const eventEmbed = await eventReminderEmbed(event.eventName, " ", event.date, " ", " ");

                await channel.send({ embeds: [eventEmbed] });
                console.log("reminder sent");
            } catch (err) {
                console.error(err);
            }
        })
    })
    console.log("schedule refreshed!");
};