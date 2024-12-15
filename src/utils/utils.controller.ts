import { Context } from "hono";
import { createLogService, getAllLogsByUserIdService } from "./utils.service";

// Add a new log
export const addLog = async (c: Context) => {
    const log = await c.req.json();
    try {
        // Create a new log
        const res = await createLogService(log);
        return c.json({ msg: "✅ Log created successfully! 🎉", res }, 201);
    } catch (error: any) {
        return c.json({ error: `⚠️ Oops! Something went wrong: ${error?.message}. Please try again!` }, 400);
    }
};

// Get all logs by User ID
export const getAllLogsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) {
        return c.text("🚫 Invalid ID! Please provide a valid user ID.", 400);
    }

    const logs = await getAllLogsByUserIdService(user_id);
    if (logs == null) {
        return c.text("❌ No logs found for this user. Maybe they haven’t created any yet? 😒", 404);
    }
    return c.json(logs, 200);
};


//being a developer is a cool thing 
