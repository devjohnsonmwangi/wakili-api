import { Context } from "hono";
import cron from "node-cron";
import {
    deleteEventReminderService,
    getEventRemindersService,
    getEventReminderByIdService,
    insertEventReminderService,
    updateEventReminderService,
    getDueRemindersService, // Import due reminders service
} from "./eventreminder.service"; // Adjust path according to your project structure
import { sendEventReminderEmail } from "../utils/nodemailer"; // Import your email logic

// Get all event reminders
export const listAllEventReminders = async (c: Context) => {
    try {
        const reminders = await getEventRemindersService();
        if (!reminders || reminders.length === 0) {
            return c.text("🔍 No event reminders found. Please add one! 📝", 404);
        }
        return c.json(reminders, 200);
    } catch (error: any) {
        return c.text("⚠️ Something went wrong while fetching event reminders. Please try again later! 🛠️", 500);
    }
};

// Get event reminder by ID
export const getEventReminderById = async (c: Context) => {
    const reminder_id = parseInt(c.req.param("reminder_id"));
    try {
        if (isNaN(reminder_id)) {
            return c.json({ msg: "🚫 Invalid reminder ID. Please provide a valid ID." }, 400);
        }
        const reminder = await getEventReminderByIdService(reminder_id);
        if (!reminder) {
            return c.json({ msg: "❌ Event reminder not found." }, 404);
        }
        return c.json(reminder, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error: ${error?.message}. Please try again!`, 400);
    }
};

// Insert a new event reminder
export const insertEventReminder = async (c: Context) => {
    try {
        const reminderData = await c.req.json();
        const { event_id, reminder_time, reminder_message } = reminderData;

        if (!event_id || !reminder_time || !reminder_message) {
            return c.json({ msg: "🚫 Missing required fields. Please provide event_id, reminder_time, and reminder_message." }, 400);
        }

        const newReminder = {
            event_id,
            reminder_time: new Date(reminder_time),
            reminder_message,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const createdReminder = await insertEventReminderService(newReminder);
        return c.json(createdReminder, 201);
    } catch (error: any) {
        return c.text(`⚠️ Error while adding reminder: ${error?.message}. Please try again!`, 400);
    }
};

// Update an event reminder
export const updateEventReminder = async (c: Context) => {
    const reminder_id = Number(c.req.param("reminder_id"));
    const reminderData = await c.req.json();

    try {
        if (isNaN(reminder_id)) {
            return c.json({ msg: "🚫 Invalid reminder ID. Please provide a valid ID." }, 400);
        }

        const existingReminder = await getEventReminderByIdService(reminder_id);
        if (!existingReminder) {
            return c.json({ msg: "❌ Reminder not found!" }, 404);
        }

        const updatedReminder = await updateEventReminderService(reminder_id, reminderData);
        return c.json({ msg: updatedReminder, updatedReminder }, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error while updating reminder: ${error?.message}. Please try again!`, 400);
    }
};

// Delete an event reminder
export const deleteEventReminder = async (c: Context) => {
    const reminder_id = parseInt(c.req.param("reminder_id"));
    try {
        if (isNaN(reminder_id)) {
            return c.json({ msg: "🚫 Invalid reminder ID. Please provide a valid ID." }, 400);
        }

        const existingReminder = await getEventReminderByIdService(reminder_id);
        if (!existingReminder) {
            return c.json({ msg: "❌ Reminder not found!" }, 404);
        }

        await deleteEventReminderService(reminder_id);
        return c.json({ msg: "✅ Event reminder deleted successfully! 🎉" }, 200);
    } catch (error: any) {
        return c.json({ msg: `⚠️ Error occurred while deleting reminder: ${error?.message}` }, 400);
    }
};

// Trigger event reminders manually (for testing or forcing)
export const triggerEventReminders = async (c: Context) => {
    try {
        const dueReminders = await getDueRemindersService();
        if (!dueReminders || dueReminders.length === 0) {
            return c.json({ msg: "✅ No due reminders at this time." }, 200);
        }

        for (const reminder of dueReminders) {
            await sendEventReminderEmail(reminder.id);
        }

        return c.json({ msg: "✅ All due reminders processed successfully!" }, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error triggering reminders: ${error?.message}. Please try again!`, 400);
    }
};

// Cron job to trigger event reminders automatically every minute
export const scheduleDueRemindersCron = () => {
    cron.schedule("* * * * *", async () => {
        console.log("⏳ Processing due reminders...");

        try {
            // Get the due reminders
            const dueReminders = await getDueRemindersService();
            if (!dueReminders || dueReminders.length === 0) {
                console.log("✅ No due reminders at this time.");
                return;
            }

            // Loop through due reminders and send email
            for (const reminder of dueReminders) {
                await sendEventReminderEmail(reminder.id);
            }

            console.log("✅ All due reminders processed successfully!");
        } catch (error) {
            console.error("⚠️ Error processing due reminders:", error);
        }
    });
};
