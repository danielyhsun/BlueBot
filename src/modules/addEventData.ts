import EventModel from "../db/models/EventModel";

export const addEventData = async (eventName: string, date: Date) => {
  if (await EventModel.exists({ eventName, date })) {
  } else {
    await EventModel.create({
      eventName,
      date,
      // Attending: attending
    });
  }
};
