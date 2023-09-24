import EventModel from "../db/models/EventModel"
import MemberModel, { Member, MemberInt } from "../db/models/MemberModel";

export const calculateAttendance = async (Member: MemberInt) => {

  let eventsAttended = 0;
  let totalEvents = 0;

  const allEvents = await EventModel.find();
  
  totalEvents = allEvents.length;
  console.log(Member.discordId);
  allEvents.forEach(event => {
    if (event.attendance.includes(Member.discordId)) {
      eventsAttended ++;
    }
  })

  let attendancePct = 0;
  if (totalEvents !== 0) {
    attendancePct = Math.ceil((eventsAttended / totalEvents) * 100);
  } 
  console.log(eventsAttended);
  console.log(totalEvents);
  console.log(attendancePct);
  Member.attendance = attendancePct;
  await Member.save();
}