import { Hono } from "hono";
import { 
    deleteEventReminder, 
    getEventReminderById, 
    insertEventReminder, 
    listAllEventReminders, 
    updateEventReminder,
    triggerEventReminders
} from "./eventreminder.controller"; // Adjust path according to your project structure

export const eventRemindersRouter = new Hono();

// Get all event reminders
eventRemindersRouter.get('/reminders', listAllEventReminders);

// Get event reminder by ID
eventRemindersRouter.get('/reminders/:reminder_id', getEventReminderById);

// Insert a new event reminder
eventRemindersRouter.post('/reminders', insertEventReminder);

// Update an event reminder by ID
eventRemindersRouter.put('/reminders/:reminder_id', updateEventReminder);

// Delete an event reminder by ID
eventRemindersRouter.delete("/reminders/:reminder_id", deleteEventReminder);

// Trigger all event reminders (reminder activity)
eventRemindersRouter.get("/reminders/trigger", triggerEventReminders);
