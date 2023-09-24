import EventModel from "../db/models/EventModel";

export const addEventData = async (eventName: string, date: Date, attendance: string[]) => {
  if (await EventModel.exists({ eventName, date })) {
  } else {
    await EventModel.create({
      eventName,
      date,
      attendance: attendance,
    });
  }
};
