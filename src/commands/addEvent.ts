// deprecated
import {
  SlashCommandBuilder,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder,
} from "discord.js";
import { type Command } from "../interfaces/Command";
import * as chrono from "chrono-node";
import { addEventData } from "../modules/addEventData";
import { refreshScheduler } from "../modules/refreshScheduler";

// Add Event to Calendar and Google Sheet so then bros can get marked down for attendance
export const addEvent: Command = {
  data: new SlashCommandBuilder().setName("addevent").setDescription("Adds Event to Calendar"),
  run: async (interaction) => {
    const eventModal = new ModalBuilder().setCustomId("CreateEventModal").setTitle("Create Event");

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

    // Display the modal
    await interaction.showModal(eventModal);

    // Wait for modal submission
    interaction
      .awaitModalSubmit({ time: 60_000 })
      .then(async (interaction) => {
        const { guild } = interaction;
        const eventName = interaction.fields.getTextInputValue("eventNameInput");
        const eventDate = interaction.fields.getTextInputValue("dateTimeInput");
        const eventLength = interaction.fields.getTextInputValue("timeLengthInput");
        const lengthValue = parseInt(eventLength) || 1;
        const location = interaction.fields.getTextInputValue("locationInput");

        // Create new scheduled event from modal submission input values
        guild?.scheduledEvents.create({
          name: eventName,
          scheduledStartTime: chrono.parseDate(eventDate),
          scheduledEndTime: chrono
            .parseDate(eventDate)
            .setHours(chrono.parseDate(eventDate).getHours() + lengthValue),
          privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
          entityType: GuildScheduledEventEntityType.External,
          entityMetadata: { location },
        });

        // Add event data to db after the guild scheduled event is created
        // await addEventData(eventName, chrono.parseDate(eventDate));
        // Refresh scheduler after event data is added to db
        await refreshScheduler(interaction.client);

        interaction.reply({
          content: `Event "${eventName}" at ${chrono.parseDate(eventDate)} created!`,
          ephemeral: true,
        });
      })
      .catch((err) => {
        console.log("No modal submit interaction collected: " + err);
      });
  },
};
