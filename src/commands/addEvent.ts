import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    GuildScheduledEventManager, 
    Guild, 
    GuildScheduledEventEntityType, 
    GuildScheduledEventPrivacyLevel, 
    DMChannel, 
    Client, 
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ActionRowBuilder
} from 'discord.js';
import { Command } from "../interfaces/Command";
import { updateMemberData } from "../modules/updateMemberData";
import { getMemberData } from "../modules/getMemberData";
import { Event } from '../db/models/EventModel';
import { ModalSubmitInteraction } from 'discord.js';
import * as chrono from "chrono-node";

//Add Event to Calendar and Google Sheet so then bros can get marked down for attendance
export const addEvent: Command = {
    data: new SlashCommandBuilder()
        .setName("addevent")
        .setDescription("Adds Event to Calendar"),
    run: async (interaction) => {
        // await interaction.deferReply();
        const guild = interaction.guild;
        const eventModal = new ModalBuilder()
            .setCustomId("CreateEventModal")
            .setTitle("Create Event");

        const eventNameInput = new TextInputBuilder()
            .setCustomId("eventNameInput")
            .setLabel("Event Name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const dateTimeInput = new TextInputBuilder()
            .setCustomId("dateTimeInput")
            .setLabel("Event Date and Time")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const timeLengthInput = new TextInputBuilder()
            .setCustomId("timeLengthInput")
            .setLabel("Event Length")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Default length - 1 hour")
            .setRequired(false);
        const locationInput = new TextInputBuilder()
            .setCustomId("locationInput")
            .setLabel("Event Location")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(eventNameInput);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(dateTimeInput);
        const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(timeLengthInput);
        const fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(locationInput);

        eventModal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        await interaction.showModal(eventModal);

        interaction.awaitModalSubmit({ time: 60_000 })
            .then(interaction => {
                const guild = interaction.guild;
                const eventName = interaction.fields.getTextInputValue("eventNameInput");
                const eventDate = interaction.fields.getTextInputValue("dateTimeInput");
                const eventLength = interaction.fields.getTextInputValue("timeLengthInput");
                const lengthValue = parseInt(eventLength) || 1;
                const location = interaction.fields.getTextInputValue("locationInput");

                const event = guild?.scheduledEvents.create({
                    name: eventName,
                    scheduledStartTime: chrono.parseDate(eventDate),
                    scheduledEndTime: chrono.parseDate(eventDate).setHours(chrono.parseDate(eventDate).getHours() + lengthValue),
                    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                    entityType: GuildScheduledEventEntityType.External,
                    entityMetadata: { location: location }
                });
                interaction.reply({ content: `Event "${ eventName }" at ${chrono.parseDate(eventDate)} created!`});
            })
            .catch(err => console.log("No modal submit interaction collected"));
    }, 
}