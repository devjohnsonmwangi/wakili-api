// import { Context } from "hono"; // Assuming you're using Hono for routing
// import { createCalendarEventService } from "./calenderintegration.service";

// // Controller to handle adding an event to the calendar
// export const addEventToCalendar = async (c: Context) => {
//   try {
//     // Get the request body data (event_id and calendar_type)
//     const { event_id, calendar_type } = await c.req.json();

//     if (!event_id || !calendar_type) {
//       return c.json({ msg: "🚫 Missing required fields. Please provide event_id and calendar_type." }, 400);
//     }

//     // Call the service to add the event to the calendar
//     const result = await createCalendarEventService(event_id, calendar_type);

//     return c.json({ msg: result });
//   } catch (error) {
//     console.error("Error adding event to calendar:", error);
//     return c.json({ msg: "❌ Failed to add event to the calendar." }, 500);
//   }
// };
