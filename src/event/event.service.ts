import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { eventTable } from "../drizzle/schema";
import { TEventInsert, TEventSelect } from "../drizzle/schema";

// Fetch all events
export const getEventsService = async (): Promise<TEventSelect[] | null> => {
    return await db.query.eventTable.findMany();
};

// Fetch event by ID
export const getEventByIdService = async (event_id: number): Promise<TEventSelect | undefined> => {
    return await db.query.eventTable.findFirst({
        where: eq(eventTable.event_id, event_id)
    });
};

// Insert a new event
export const insertEventService = async (event: TEventInsert): Promise<{ event_id: number } | undefined> => {
    const result = await db.insert(eventTable).values(event)
        .returning({ event_id: eventTable.event_id })
        .execute();
    return result[0];
};

// Update an existing event
export const updateEventService = async (event_id: number, event: TEventInsert) => {
    await db.update(eventTable).set(event).where(eq(eventTable.event_id, event_id));
    return "Event updated successfully 🎉";
};

// Delete an event
export const deleteEventService = async (event_id: number) => {
    await db.delete(eventTable).where(eq(eventTable.event_id, event_id));
    return "Event deleted successfully 🎉";
};
