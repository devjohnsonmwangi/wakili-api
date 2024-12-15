// import { eq } from "drizzle-orm";
// import db from "../drizzle/db";
// import { calendarIntegrationTable } from "../drizzle/schema";

// import { sendEventToCalendarAPI } from "./calendarAPI"; // Assuming a helper to send events to Google/Outlook
// import { sendReminderNotification } from "./notificationService"; // A helper for sending reminders/alarms

// // Service to create calendar event and set reminders
// export const createCalendarEventService = async (eventId: number, calendarType: string) => {
//   const event = await db.select().from(eventTable).where({ event_id: eventId }).first();

//   if (!event) {
//     throw new Error("Event not found");
//   }

//   // Event details
//   const { event_name, event_date, event_description } = event;

//   // Send the event to Google or Outlook Calendar
//   const calendarEvent = await sendEventToCalendarAPI(event_name, event_date, event_description, calendarType);

//   // Save the calendar integration to the database
//   const calendarIntegration = await db.insert(calendarIntegrationTable).values({
//     event_id: eventId,
//     calendar_type: calendarType,
//     calendar_event_id: calendarEvent.calendar_event_id,
//   }).returning(["calendar_id", "calendar_event_id"]);

//   // Set reminder/notification for the user
//   sendReminderNotification(event_date);

//   return `🎉 Event successfully added to ${calendarType} calendar! 📅 Event: ${event_name}`;
// };

// // Function to send events to external calendar API (Google, Outlook)
// export const sendEventToCalendarAPI = async (eventName: string, eventDate: Date, description: string, calendarType: string) => {
//   if (calendarType === "Google") {
//     // Send event to Google Calendar API (pseudo-code)
//     const calendarEvent = await googleCalendarAPI.addEvent(eventName, eventDate, description);
//     return { calendar_event_id: calendarEvent.id };
//   } else if (calendarType === "Outlook") {
//     // Send event to Outlook Calendar API (pseudo-code)
//     const calendarEvent = await outlookCalendarAPI.addEvent(eventName, eventDate, description);
//     return { calendar_event_id: calendarEvent.id };
//   } else {
//     throw new Error("Unsupported calendar type");
//   }
// };

// // Function to send a reminder/notification (e.g., 1 hour before the event)
// export const sendReminderNotification = (eventDate: Date) => {
//   // Send a notification to the user when the event is approaching
//   const reminderTime = new Date(eventDate).getTime() - 60 * 60 * 1000; // 1 hour before
//   // Scheduling logic for alarm/notification (pseudo-code)
//   scheduleNotification(reminderTime, "Reminder: Your event is coming up!");
// };


