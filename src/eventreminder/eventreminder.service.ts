import { eq, lt } from "drizzle-orm"; // Import comparison operator
import db from "../drizzle/db";
import { eventReminderTable } from "../drizzle/schema"; // Adjust path according to your project structure
import { add } from "date-fns"; // For date manipulation

// Get all event reminders
export const getEventRemindersService = async (): Promise<any[] | null> => {
    return await db.query.eventReminderTable.findMany();
};

// Get event reminder by ID
export const getEventReminderByIdService = async (reminder_id: number): Promise<any | undefined> => {
    return await db.query.eventReminderTable.findFirst({
        where: eq(eventReminderTable.reminder_id, reminder_id),
    });
};

// Get event reminders by event ID
export const getEventRemindersByEventIdService = async (event_id: number): Promise<any[] | null> => {
    return await db.query.eventReminderTable.findMany({
        where: eq(eventReminderTable.event_id, event_id),
    });
};

// Insert a new event reminder
export const insertEventReminderService = async (reminder: any) => {
    return await db.insert(eventReminderTable).values(reminder).returning({
        reminder_id: eventReminderTable.reminder_id,
        event_id: eventReminderTable.event_id,
        reminder_time: eventReminderTable.reminder_time,
        reminder_message: eventReminderTable.reminder_message,
        created_at: eventReminderTable.created_at,
        updated_at: eventReminderTable.updated_at,
    });
};

// Update an existing event reminder
export const updateEventReminderService = async (reminder_id: number, reminder: any) => {
    await db.update(eventReminderTable).set(reminder).where(eq(eventReminderTable.reminder_id, reminder_id));
    return "✅ Event reminder updated successfully!";
};

// Delete an event reminder
export const deleteEventReminderService = async (reminder_id: number) => {
    await db.delete(eventReminderTable).where(eq(eventReminderTable.reminder_id, reminder_id));
    return "⚡ Event reminder deleted successfully!";
};

// Create reminders for the event at 3 different intervals (2 weeks, 2 days, 2 hours before)
export const createEventReminders = async (event_id: number, event_date: Date) => {
    try {
        const reminders = [
            {
                reminder_time: add(new Date(event_date), { weeks: -2 }), // 2 weeks before
                reminder_message: "📅 Reminder: 2 weeks until your event!",
            },
            {
                reminder_time: add(new Date(event_date), { days: -2 }), // 2 days before
                reminder_message: "📅 Reminder: 2 days until your event!",
            },
            {
                reminder_time: add(new Date(event_date), { hours: -2 }), // 2 hours before
                reminder_message: "📅 Reminder: 2 hours until your event!",
            },
        ];

        for (const reminder of reminders) {
            await db.insert(eventReminderTable).values({
                event_id,
                reminder_time: reminder.reminder_time,
                reminder_message: reminder.reminder_message,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        console.log(`✅ Reminders created for event ${event_id}`);
    } catch (error) {
        console.error("⚠️ Error creating reminders:", error);
    }
};

// Get due reminders (those that are due or past due)
export const getDueRemindersService = async (): Promise<any[] | null> => {
    try {
        const now = new Date();
        return await db.query.eventReminderTable.findMany({
            where: lt(eventReminderTable.reminder_time, now), // Fetch reminders where time is less than current time
        });
    } catch (error) {
        console.error("⚠️ Error fetching due reminders:", error);
        return null;
    }
};
