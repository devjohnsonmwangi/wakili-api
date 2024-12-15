import { Context } from "hono";
import { 
    deleteEventService, 
    getEventByIdService, 
    getEventsService, 
    insertEventService, 
    updateEventService 
} from "./event.service";
import { convertDates } from "../date-utils"; // Import the convertDates utility

// Helper function to validate event data
const validateEventData = (event: any) => {
    if (!event.event_name || !event.event_date) {
        throw new Error("⚠️ Event name and event date are required fields.");
    }

    // Additional validation checks can be added here (e.g., for valid date formats)
};

// Get all events
export const listAllEvents = async (c: Context) => {
    try {
        const events = await getEventsService();
        if (!events || events.length === 0) {
            return c.text("😕 Oops! No events found. Come back soon for exciting updates! 🎉", 404);
        }

        // Convert date fields in all events
        const convertedEvents = events.map(event => 
            convertDates(event, ["event_date"]) // Specify the date fields to convert
        );

        return c.json(convertedEvents, 200);
    } catch (error: any) {
        return c.text(`⚠️ Something went wrong while fetching events: ${error.message}. Please try again later! 🛠️`, 500);
    }
};

// Get event by ID
export const getEventById = async (c: Context) => {
    const event_id = parseInt(c.req.param("event_id"));
    try {
        if (isNaN(event_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid event ID." }, 400);
        }
        const event = await getEventByIdService(event_id);
        if (!event) {
            return c.json({ msg: "❌ Event not found. Double-check the ID and try again!" }, 404);
        }

        // Convert date fields in the event
        const convertedEvent = convertDates(event, ["event_date"]); // Specify the date fields

        return c.json(convertedEvent, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error: ${error?.message}. Please try again!`, 400);
    }
};

// Insert a new event
export const insertEvent = async (c: Context) => {
    try {
        const event = await c.req.json();

        // Validate event data
        validateEventData(event);

        // Convert date fields before inserting
        const convertedEvent = convertDates(event, ["event_date", "start_time"]); // Specify the date fields

        const createdEvent = await insertEventService(convertedEvent);
        if (!createdEvent) {
            return c.json({ msg: "❌ Event could not be created. Please try again later. 😒" }, 400);
        }
        return c.json(createdEvent, 201);
    } catch (error: any) {
        return c.text(`⚠️ Something went wrong: ${error?.message}. Try again!`, 400);
    }
};

// Update an existing event
export const updateEvent = async (c: Context) => {
    const event_id = Number(c.req.param("event_id"));
    let event = await c.req.json();
    try {
        if (isNaN(event_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid event ID." }, 400);
        }
        const existingEvent = await getEventByIdService(event_id);
        if (!existingEvent) {
            return c.json({ msg: "❌ Event not found. Double-check the ID and try again!" }, 404);
        }

        // Validate event data
        validateEventData(event);

        // Convert date fields before updating
        event = convertDates(event, ["event_date", "start_time", "end_time"]); // Specify the date fields

        const updatedEvent = await updateEventService(event_id, event);
        return c.json({ msg: "✅ Event updated successfully! 🎉", updatedEvent }, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error while updating event: ${error?.message}`, 400);
    }
};

// Delete an event
export const deleteEvent = async (c: Context) => {
    const event_id = parseInt(c.req.param("event_id"));
    try {
        if (isNaN(event_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid event ID." }, 400);
        }
        const existingEvent = await getEventByIdService(event_id);
        if (!existingEvent) {
            return c.json({ msg: "❌ Event not found. Please check the ID!" }, 404);
        }
        const deletedEvent = await deleteEventService(event_id);
        return c.json({ msg: "✅ Event deleted successfully! 🚀", deletedEvent }, 200);
    } catch (error: any) {
        return c.json({ msg: `⚠️ Error occurred while deleting event: ${error?.message}` }, 400);
    }
};
