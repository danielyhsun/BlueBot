import EventModel from "../db/models/EventModel"
import Types from "mongoose";

export const addEventData = async (eventName: string, date: Date) => {
    if (await EventModel.exists({ eventName: eventName, date: date })) {
        return;
    } else {
        await EventModel.create({ 
            eventName: eventName, 
            date: date, 
            // attending: attending
        });
    }
}