import { EmbedBuilder } from "discord.js";

export const eventReminderEmbed = async (
  eventName: string,
  time: Date,
  duration: string,
  location: string
) => {
  const embed = new EmbedBuilder();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const calendarEmoji = "🗓️";
  embed
    .setColor("DarkBlue")
    .setTitle(`${calendarEmoji} ${eventName}`)
    .addFields(
      { name: "Time", value: time.toLocaleString("en-US", options) },
      { name: "Location", value: location },
      { name: "Duration", value: duration }
    );

  return embed;
};
